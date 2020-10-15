import * as express from "express";
import * as Mongo from "mongodb";
import Quiz from "../models/quiz";

const router = express.Router();

// Render routes
router.get("/quizzes", async (_, res) => {
  const quizzes = await Quiz.getAll();
  return res.render("list-quiz", { quizzes });
});

router.get("/quizzes/new", async (_, res) => {
  const quiz = { name: "", description: "", problems: [] };
  return res.render("edit-quiz", { method: "POST", action: "/quizzes", quiz });
});

router.get("/quizzes/:id/edit", async (req, res) => {
  const { id } = req.params;
  const quiz = await Quiz.get(new Mongo.ObjectId(id));
  return res.render("edit-quiz", {
    method: "PUT",
    action: `/quizzes/${id}`,
    quiz,
  });
});

router.get("/quizzes/:id/export", async (req, res) => {
  const { id } = req.params;
  const quiz = await Quiz.get(new Mongo.ObjectId(id));
  delete quiz._id;
  res.setHeader("Content-Disposition", `attachment; filename=${quiz.name}.json`);
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(quiz));
});

// CRUD routes
router.post("/quizzes", async (req, res) => {
  const { name, description, append } = req.body;
  const problems = append ? [{ question: "", answer: "" }] : [];
  const id = await Quiz.create(name, description, problems);
  return res.redirect(`/quizzes/${id}/edit`);
});

router.put("/quizzes/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, append, deletions } = req.body;
  const toDelete = new Set(Array.from(deletions || []).map(Number));
  const problems = (req.body.problems || [])
    .concat(append ? [{ question: "", answer: "" }] : [])
    .filter(function filterOutDeletions(_: any, index: number) {
      return !toDelete.has(index);
    });
  await Quiz.update(new Mongo.ObjectId(id), name, description, problems);
  return res.redirect(`/quizzes/${id}/edit`);
});

router.post("/import/:id", async (req, res) => {
  const { id } = req.params;
  if (req.files) {
    const { name, description, problems }= await Quiz.get(new Mongo.ObjectId(id));
    const { problems: newProblems } = JSON.parse(req.files.import_file.data.toString("utf-8"));
    await Quiz.update(new Mongo.ObjectId(id), name, description, problems.concat(newProblems));
    return res.redirect(`/quizzes/${id}/edit`);
  } else {
    throw new Error("No file uploaded");
  }
});

router.delete("/quizzes/:id", async (req, res) => {
  const { id } = req.params;
  await Quiz.delete(new Mongo.ObjectId(id));
  return res.redirect("/quizzes");
});

export default router;
