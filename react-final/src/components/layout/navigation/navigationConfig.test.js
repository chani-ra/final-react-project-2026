import test from "node:test";
import assert from "node:assert/strict";
import {
  getNavLinks,
  isNavActive,
} from "./navigationConfig.js";

test("each role has its own navigation", () => {
  for (const role of ["student", "teacher", "admin"]) {
    const links = getNavLinks(role);

    assert.ok(links.length >= 5);
    assert.ok(
      links.every(
        x => x.name && x.path.startsWith("/")
      )
    );
    assert.equal(
      new Set(links.map(x => x.path)).size,
      links.length
    );
  }

  assert.ok(
    getNavLinks("teacher").some(
      x => x.path === "/teacher/library"
    )
  );

  assert.ok(
    getNavLinks("admin").some(
      x => x.path === "/admin/users"
    )
  );

  assert.ok(
    !getNavLinks("student").some(
      x => x.path.startsWith("/admin/")
    )
  );
});

test("active links match valid paths only", () => {
  assert.equal(isNavActive("/", "/"), true);
  assert.equal(isNavActive("/courses", "/"), false);

  assert.equal(
    isNavActive(
      "/teacher/students/123",
      "/teacher/students"
    ),
    true
  );

  assert.equal(
    isNavActive(
      "/teacher/studentship",
      "/teacher/students"
    ),
    false
  );
});

test("final desktop and mobile navigation order is single-source", () => {
  const expectedAdmin = ["/admin/dashboard", "/admin/users", "/admin/content", "/admin/messages", "/admin/reviews", "/admin/settings", "/messages", "/", "/admin/learning"];
  assert.deepEqual(getNavLinks("admin").map(link => link.path), expectedAdmin);
  for (const role of ["student", "teacher", "admin"]) {
    const links = getNavLinks(role);
    assert.equal(new Set(links.map(link => link.path)).size, links.length);
  }
});
