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

    function professionCount(group: any): [any, any] {
      return [group[0], group[1].length];
    }

    // SELECT profession, count(profession) FROM persons GROUPBY profession
    expect(
      query<typeof persons>()
        .select(professionCount)
        .from(persons)
        .groupBy(profession)
        .execute()
    ).toStrictEqual([
      ["teacher", 3],
      ["scientific", 3],
      ["politician", 1],
    ]);

    function name(person: any) {
      return person.name;
    }

    // SELECT * FROM persons WHERE profession='teacher' GROUPBY profession, name
    expect(
      query<typeof persons>()
        .select()
        .from(persons)
        .groupBy(profession, name)
        .execute()
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

    function age(person: any) {
      return person.age;
    }

    function maritalStatus(person: any) {
      return person.maritalStatus;
    }

    expect(
      query<typeof persons>()
        .select()
        .from(persons)
        .groupBy(profession, name, age, maritalStatus)
        .execute()
    ).toStrictEqual([
      [
        "teacher",
        [
          [
            "Peter",
            [
              [
                20,
                [
                  [
                    "married",
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
                ],
              ],
            ],
          ],
          [
            "Michael",
            [
              [
                50,
                [
                  [
                    "single",
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
              [
                20,
                [
                  [
                    "married",
                    [
                      {
                        name: "Anna",
                        profession: "scientific",
                        age: 20,
                        maritalStatus: "married",
                      },
                    ],
                  ],
                  [
                    "single",
                    [
                      {
                        name: "Anna",
                        profession: "scientific",
                        age: 20,
                        maritalStatus: "single",
                      },
                    ],
                  ],
                ],
              ],
            ],
          ],
          [
            "Rose",
            [
              [
                50,
                [
                  [
                    "married",
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
              [
                50,
                [
                  [
                    "married",
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
            ],
          ],
        ],
      ],
    ]);

    function naturalCompare(value1: any, value2: any) {
      if (value1 < value2) {
        return -1;
      } else if (value1 > value2) {
        return 1;
      } else {
        return 0;
      }
    }

    // SELECT profession, count(profession) FROM persons GROUPBY profession ORDER BY profession
    expect(
      query<typeof persons>()
        .select(professionCount)
        .from(persons)
        .groupBy(profession)
        .orderBy(naturalCompare)
        .execute()
    ).toStrictEqual([
      ["politician", 1],
      ["scientific", 3],
      ["teacher", 3],
    ]);
  });

  test("Number tests", () => {
    function isEven(number: number) {
      return number % 2 === 0;
    }

    function parity(number: number) {
      return isEven(number) ? "even" : "odd";
    }

    function isPrime(number: number) {
      if (number < 2) {
        return false;
      }
      var divisor = 2;
      for (; number % divisor !== 0; divisor++);
      return divisor === number;
    }

    function prime(number: number) {
      return isPrime(number) ? "prime" : "divisible";
    }

    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // SELECT * FROM numbers
    expect(
      query<typeof numbers>().select().from(numbers).execute()
    ).toStrictEqual(numbers);

    // SELECT * FROM numbers GROUP BY parity
    expect(
      query<typeof numbers>().select().from(numbers).groupBy(parity).execute()
    ).toStrictEqual([
      ["odd", [1, 3, 5, 7, 9]],
      ["even", [2, 4, 6, 8]],
    ]);

    // SELECT * FROM numbers GROUP BY parity, isPrime
    expect(
      query<typeof numbers>()
        .select()
        .from(numbers)
        .groupBy(parity, prime)
        .execute()
    ).toStrictEqual([
      [
        "odd",
        [
          ["divisible", [1, 9]],
          ["prime", [3, 5, 7]],
        ],
      ],
      [
        "even",
        [
          ["prime", [2]],
          ["divisible", [4, 6, 8]],
        ],
      ],
    ]);

    function odd(group: any) {
      return group[0] === "odd";
    }

    // SELECT * FROM numbers GROUP BY parity HAVING
    expect(
      query<typeof numbers>()
        .select()
        .from(numbers)
        .groupBy(parity)
        .having(odd)
        .execute()
    ).toStrictEqual([["odd", [1, 3, 5, 7, 9]]]);

    function descendentCompare(number1: number, number2: number) {
      return number2 - number1;
    }

    // SELECT * FROM numbers ORDER BY value DESC
    expect(
      query<typeof numbers>()
        .select()
        .from(numbers)
        .orderBy(descendentCompare)
        .execute()
    ).toStrictEqual([9, 8, 7, 6, 5, 4, 3, 2, 1]);

    function lessThan3(number: number) {
      return number < 3;
    }

    function greaterThan4(number: number) {
      return number > 4;
    }

    // SELECT * FROM number WHERE number < 3 OR number > 4
    // expect(
    //   query<typeof numbers>()
    //     .select()
    //     .from(numbers)
    //     .where(lessThan3, greaterThan4)
    //     .execute()
    // ).toStrictEqual([1, 2, 5, 6, 7, 8, 9]);
  });

  test("transform", () => {
    const _set = (obj: any, path: string[], value: any) => {
      var schema = obj;
      var pList = path;
      var len = pList.length;
      for (var i = 0; i < len - 1; i++) {
        var elem = pList[i];
        if (!schema[elem]) schema[elem] = {};
        schema = schema[elem];
      }

      if (!Array.isArray(schema[pList[len - 1]])) schema[pList[len - 1]] = [];
      schema[pList[len - 1]].push(value);
    };

    const entities = (obj: any) => {
      const res: any[] = [];
      if (Array.isArray(obj)) return obj;
      for (const [k, v] of Object.entries(obj)) {
        res.push([k, entities(v)]);
      }
      return res;
    };

    // const val = {};
    // _set(val, ["a", "b"], 1);
    // _set(val, ["a", "b"], 2);
    // _set(val, ["a", "c"], 3);

    // console.dir(val, { depth: 100 });
    // console.dir(entities(val), { depth: 100 });

    const val1 = {
      teacher: {
        Peter: [
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
        Michael: [
          {
            name: "Michael",
            profession: "teacher",
            age: 50,
            maritalStatus: "single",
          },
        ],
      },
      scientific: {
        Anna: [
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
        Rose: [
          {
            name: "Rose",
            profession: "scientific",
            age: 50,
            maritalStatus: "married",
          },
        ],
      },
      politician: {
        Anna: [
          {
            name: "Anna",
            profession: "politician",
            age: 50,
            maritalStatus: "married",
          },
        ],
      },
    };
    const f = entities(val1);
    console.dir(f, { depth: 100 });
    expect(f).toEqual([
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
});
