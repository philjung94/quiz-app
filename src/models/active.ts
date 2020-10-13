import * as Mongo from "mongodb";
import * as db from "../db";
import { shuffle } from "../helpers";
import { Problem } from "./quiz";

type ActiveProblem = Problem & {
  response: string;
};

type Active = {
  isComplete: boolean;
  quizId: Mongo.ObjectId;
  quizName: string;
  order: number[];
  problems: ActiveProblem[];
};

const collection = db.get().collection("active");

export default {
  create(quizId: Mongo.ObjectId, quizName: string, problems: Problem[]) {
    const order = shuffle([...Array(problems.length).keys()]);
    const activeProblems = problems.map(problem => ({
      ...problem,
      response: "",
    } as ActiveProblem));
    const active: Active = {
      isComplete: false,
      problems: activeProblems,
      quizId,
      quizName,
      order,
    };
    return collection.insertOne(active).then((response) => response.insertedId);
  },
  delete(_id: Mongo.ObjectId) {
    return collection.findOneAndDelete({ _id });
  },
  get(_id: Mongo.ObjectId): Promise<Active> {
    return collection.findOne({ _id }) as Promise<Active>;
  },
  getAll(): Promise<Active[]> {
    return collection.find().toArray();
  },
  update(_id: Mongo.ObjectId, problems: ActiveProblem[], isComplete: boolean) {
    return collection.findOneAndUpdate({ _id }, { $set: { isComplete, problems } });
  },
};
