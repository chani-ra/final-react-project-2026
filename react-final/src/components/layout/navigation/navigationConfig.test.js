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
