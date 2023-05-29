import { describe, expect, test } from "@jest/globals";
import { query } from "./sqlEngine";

describe("sql engine", () => {
  test("Basic SELECT tests", () => {
    var numbers = [1, 2, 3];
    expect(query().select().from(numbers).execute()).toStrictEqual(numbers);

    //The order does not matter
    expect(query().from(numbers).select().execute()).toStrictEqual(numbers);

    // SELECT can be omited
    expect(query().execute()).toStrictEqual([]);

    // No FROM clause produces empty array
    expect(query().select().execute()).toStrictEqual([]);

    // Select can be omited
    expect(query().from(numbers).execute()).toStrictEqual(numbers);
  });

  test("Basic SELECT and WHERE over objects", () => {
    var persons = [
      {
        name: "Peter",
        profession: "teacher",
        age: 20,
        maritalStatus: "married",
      },
      {
        name: "Michael",
        profession: "teacher",
        age: 50,
        maritalStatus: "single",
      },
      {
        name: "Peter",
        profession: "teacher",
        age: 20,
        maritalStatus: "married",
      },
      {
        name: "Anna",
        profession: "scientific",
        age: 20,
        maritalStatus: "married",
      },
      {
        name: "Rose",
        profession: "scientific",
        age: 50,
        maritalStatus: "married",
      },
      {
        name: "Anna",
        profession: "scientific",
        age: 20,
        maritalStatus: "single",
      },
      {
        name: "Anna",
        profession: "politician",
        age: 50,
        maritalStatus: "married",
      },
    ];

    expect(
      query<typeof persons>().select().from(persons).execute()
    ).toStrictEqual(persons);

    function profession(person: any) {
      return person.profession;
    }
    expect(
      query<typeof persons>().select(profession).from(persons).execute()
    ).toStrictEqual([
      "teacher",
      "teacher",
      "teacher",
      "scientific",
      "scientific",
      "scientific",
      "politician",
    ]);

    // No FROM clause produces empty array
    expect(query<typeof persons>().select(profession).execute()).toStrictEqual(
      []
    );

    function isTeacher(person: any) {
      return person.profession === "teacher";
    }
    // SELECT profession FROM persons WHERE profession="teacher"
    expect(
      query<typeof persons>()
        .select(profession)
        .from(persons)
        .where(isTeacher)
        .execute()
    ).toStrictEqual(["teacher", "teacher", "teacher"]);

    // SELECT * FROM persons WHERE profession="teacher"
    expect(
      query<typeof persons>().from(persons).where(isTeacher).execute()
    ).toStrictEqual(persons.slice(0, 3));

    function name(person: any) {
      return person.name;
    }
    // SELECT name FROM persons WHERE profession="teacher"
    expect(
      query().select(name).from(persons).where(isTeacher).execute()
    ).toStrictEqual(["Peter", "Michael", "Peter"]);
    expect(
      query().where(isTeacher).from(persons).select(name).execute()
    ).toStrictEqual(["Peter", "Michael", "Peter"]);
  });
});
