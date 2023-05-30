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

  test("GROUP BY tests", () => {
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

    function profession(person: any) {
      return person.profession;
    }

    // SELECT * FROM persons GROUPBY profession <- Bad in SQL but possible in JavaScript
    expect(
      query<typeof persons>()
        .select()
        .from(persons)
        .groupBy(profession)
        .execute()
    ).toStrictEqual([
      [
        "teacher",
        [
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
        ],
      ],
      [
        "scientific",
        [
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
        ],
      ],
      [
        "politician",
        [
          {
            name: "Anna",
            profession: "politician",
            age: 50,
            maritalStatus: "married",
          },
        ],
      ],
    ]);

    function isTeacher(person: any) {
      return person.profession === "teacher";
    }

    expect(
      query<typeof persons>()
        .select()
        .from(persons)
        .where(isTeacher)
        .groupBy(profession)
        .execute()
    ).toStrictEqual([
      [
        "teacher",
        [
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
        ],
      ],
    ]);

    function professionGroup(group: any) {
      return group[0];
    }

    // SELECT profession FROM persons GROUPBY profession
    expect(
      query<typeof persons>()
        .select(professionGroup)
        .from(persons)
        .groupBy(profession)
        .execute()
    ).toStrictEqual(["teacher", "scientific", "politician"]);

    function professionCount(group: any) {
      return [group[0], group[1].length];
    }

    // SELECT profession, count(profession) FROM persons GROUPBY profession
    expect(
      query()
        .select(professionCount)
        .from(persons)
        .groupBy(profession)
        .execute()
    ).toStrictEqual([
      ["teacher", 3],
      ["scientific", 3],
      ["politician", 1],
    ]);
  });

  test.skip("wip", () => {
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

    function name(person: any) {
      return person.name;
    }
    function profession(person: any) {
      return person.profession;
    }
    // WIP
    // SELECT * FROM persons WHERE profession='teacher' GROUPBY profession, name
    expect(
      query().select().from(persons).groupBy(profession, name).execute()
    ).toStrictEqual([
      [
        "teacher",
        [
          [
            "Peter",
            [
              {
                name: "Peter",
                profession: "teacher",
                age: 20,
                maritalStatus: "married",
              },
              {
                name: "Peter",
                profession: "teacher",
                age: 20,
                maritalStatus: "married",
              },
            ],
          ],
          [
            "Michael",
            [
              {
                name: "Michael",
                profession: "teacher",
                age: 50,
                maritalStatus: "single",
              },
            ],
          ],
        ],
      ],
      [
        "scientific",
        [
          [
            "Anna",
            [
              {
                name: "Anna",
                profession: "scientific",
                age: 20,
                maritalStatus: "married",
              },
              {
                name: "Anna",
                profession: "scientific",
                age: 20,
                maritalStatus: "single",
              },
            ],
          ],
          [
            "Rose",
            [
              {
                name: "Rose",
                profession: "scientific",
                age: 50,
                maritalStatus: "married",
              },
            ],
          ],
        ],
      ],
      [
        "politician",
        [
          [
            "Anna",
            [
              {
                name: "Anna",
                profession: "politician",
                age: 50,
                maritalStatus: "married",
              },
            ],
          ],
        ],
      ],
    ]);
  });

  test("transform", () => {
    const inp = {
      "teacher.Peter": [
        {
          name: "Peter",
          profession: "teacher",
          age: 20,
          maritalStatus: "married",
        },
        {
          name: "Peter",
          profession: "teacher",
          age: 20,
          maritalStatus: "married",
        },
      ],
      "teacher.Michael": [
        {
          name: "Michael",
          profession: "teacher",
          age: 50,
          maritalStatus: "single",
        },
      ],
      "scientific.Anna": [
        {
          name: "Anna",
          profession: "scientific",
          age: 20,
          maritalStatus: "married",
        },
        {
          name: "Anna",
          profession: "scientific",
          age: 20,
          maritalStatus: "single",
        },
      ],
      "scientific.Rose": [
        {
          name: "Rose",
          profession: "scientific",
          age: 50,
          maritalStatus: "married",
        },
      ],
      "politician.Anna": [
        {
          name: "Anna",
          profession: "politician",
          age: 50,
          maritalStatus: "married",
        },
      ],
    };

    const out = [
      [
        "teacher",
        [
          [
            "Peter",
            [
              {
                name: "Peter",
                profession: "teacher",
                age: 20,
                maritalStatus: "married",
              },
              {
                name: "Peter",
                profession: "teacher",
                age: 20,
                maritalStatus: "married",
              },
            ],
          ],
          [
            "Michael",
            [
              {
                name: "Michael",
                profession: "teacher",
                age: 50,
                maritalStatus: "single",
              },
            ],
          ],
        ],
      ],
      [
        "scientific",
        [
          [
            "Anna",
            [
              {
                name: "Anna",
                profession: "scientific",
                age: 20,
                maritalStatus: "married",
              },
              {
                name: "Anna",
                profession: "scientific",
                age: 20,
                maritalStatus: "single",
              },
            ],
          ],
          [
            "Rose",
            [
              {
                name: "Rose",
                profession: "scientific",
                age: 50,
                maritalStatus: "married",
              },
            ],
          ],
        ],
      ],
      [
        "politician",
        [
          [
            "Anna",
            [
              {
                name: "Anna",
                profession: "politician",
                age: 50,
                maritalStatus: "married",
              },
            ],
          ],
        ],
      ],
    ];
  });
});
