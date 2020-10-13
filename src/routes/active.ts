import * as express from "express";
import * as Mongo from "mongodb";
import Active from "../models/active";
import Quiz from "../models/quiz";

const router = express.Router();

// Render routes
router.get("/active", async (_, res) => {
  const active = await Active.getAll();
  return res.render("list-active", { active });
});

router.get("/active/:id", async (req, res) => {
  const { id } = req.params;
  const active = await Active.get(new Mongo.ObjectId(id));
  const { name, description } = await Quiz.get(active.quizId);
  return res.render("edit-active", {
    name,
    description,
    ...active,
  });
});

// CRUD routes
router.post("/active/:quizId", async (req, res) => {
  const { quizId } = req.params;
  const { name, problems } = await Quiz.get(new Mongo.ObjectId(quizId));
  const id = await Active.create(new Mongo.ObjectId(quizId), name, problems);
  return res.redirect(`/active/${id}`);
});

router.put("/active/:id", async (req, res) => {
  const { id } = req.params;
  const { isComplete, problems } = req.body;
  await Active.update(new Mongo.ObjectId(id), problems, !!isComplete);
  return res.redirect("/active");
});

router.delete("/active/:id", async (req, res) => {
  const { id } = req.params;
  await Active.delete(new Mongo.ObjectId(id));
  return res.redirect("/active");
});

export default router;
