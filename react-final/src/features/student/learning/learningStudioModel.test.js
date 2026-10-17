import test from "node:test";
import assert from "node:assert/strict";
import { initialLearningSelection, subcategoriesOf, learningRequest } from "./learningStudioModel.js";
const categories = [{ _id: "g", subcategories: [{ _id: "s", name: "Past Simple" }] }, { _id: "v", subcategories: [] }];
test("selects the first real category and subcategory", () => {
  assert.deepEqual(initialLearningSelection(categories), { categoryId: "g", subcategoryId: "s" });
});
test("subcategory list depends on selected category", () => {
  assert.equal(subcategoriesOf(categories, "g")[0]._id, "s");
  assert.deepEqual(subcategoriesOf(categories, "v"), []);
});
test("validates, trims and preserves provider selection", () => {
  assert.deepEqual(learningRequest({ categoryId: "g", subcategoryId: "s", provider: "openai", prompt: "  Explain Past Simple  " }), { categoryId: "g", subcategoryId: "s", provider: "openai", prompt: "Explain Past Simple" });
  assert.throws(() => learningRequest({ categoryId: "g", subcategoryId: "s", provider: "other", prompt: "Explain Past Simple" }));
  assert.throws(() => learningRequest({ categoryId: "g", subcategoryId: "s", provider: "gemini", prompt: "no" }));
});
