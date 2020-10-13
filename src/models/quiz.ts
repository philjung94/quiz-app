import * as Mongo from "mongodb";
import * as db from "../db";

export type Problem = {
  question: string;
  answer: string;
};

export type Quiz = {
  name: string;
  description: string;
  problems: Problem[];
};

const collection = db.get().collection("quizzes");
export default {
  create(name: string, description: string, problems: Problem[]): Promise<string> {
    const quiz: Quiz = { name, description, problems };
    return collection.insertOne(quiz).then((response) => response.insertedId);
  },
  delete(_id: Mongo.ObjectId) {
    return collection.findOneAndDelete({ _id });
  },
  get(_id: Mongo.ObjectId): Promise<Quiz> {
    return collection.findOne({ _id }) as Promise<Quiz>;
  },
  getAll(): Promise<Quiz[]> {
    return collection.find().toArray();
  },
  update(_id: Mongo.ObjectId, name: string, description: string, problems: Problem[]) {
    const quiz: Quiz = { name, description, problems };
    return collection.findOneAndUpdate(
      { _id },
      {
        $set: quiz,
      },
    );
  },
};
