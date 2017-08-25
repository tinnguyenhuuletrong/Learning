function SQLEngine(database) {
	let CMD = {}

	function parseToken(queryString) {
		return queryString.match(/SELECT|FROM|JOIN|WHERE|ON|,|[A-z0-9_]+|\.|<=|>=|<>|>|<|=|'(.*)'/gm)
	}

	function accept(tokens, sym) {
		return tokens[0] && (tokens[0].toLocaleLowerCase() == sym.toLocaleLowerCase()) && tokens.shift()
	}

	function word(tokens) {
		return /^[A-z][A-z0-9_]+/.test(tokens[0]) && tokens.shift()
	}

	function isNumber(tokens) {
		return !isNaN(tokens[0]) && parseInt(tokens.shift())
	}

	function isString(tokens) {
		const tmp = tokens[0]
		return /'(.*)'/.test(tokens[0]) && tokens.shift() && tmp.substring(1, tmp.length - 1).replace("''","'")
	}

	function comparison(tokens) {
		return /<=|>=|<>|>|<|=/.test(tokens[0]) && tokens.shift()
	}

	//column-id     =  word, ".", word ;
	function columnId(tokens) {
		const word1 = word(tokens)
		const dot = accept(tokens, '.')
		const word2 = word(tokens)
		if (word1 && dot && word2) {
			return [word1, word2]
		}

		return null
	}

	function isConst(tokens) {
		let res = null;
		[isNumber, isString].some(test => {
			res = test(tokens)
			return res
		})
		return res
	}

	//value         =  column-id | const
	function value(tokens) {
		let col = columnId(tokens)
		if (!col)
			col = isConst(tokens)
		return col
	}

	//value-test    =  value, comparison, value;
	function valueTest(tokens) {
		const left = value(tokens)
		const cmp = comparison(tokens)
		const right = value(tokens)

		if (left && cmp && right) {
			return [left, cmp, right]
		}
		return null
	}

	//select        =  "SELECT ", column-id, [ { ", ", column-id } ] ;
	function select(tokens) {
		const sel = accept(tokens, "SELECT")
		const colId = columnId(tokens)

		if (!sel || !colId)
			return null

		let res = [colId]
		while (accept(tokens, ',')) {
			let tmp = columnId(tokens)
			res.push(tmp)
		}

		CMD["select"] = res
		return res
	}

	//join          =  "JOIN ", table-name, " on ", value-test ;
	function join(tokens) {
		const pharse = accept(tokens, "JOIN")

		if (!pharse)
			return null

		const tbSrc = word(tokens)
		const keyWord = accept(tokens, "ON")
		const con = valueTest(tokens)

		if (pharse && tbSrc && keyWord && con)
			return {
				src: tbSrc,
				con: con
			}
		return null
	}

	//from          =  "FROM ", table-name, [ { ws, join } ] ;
	function from(tokens) {
		const pharse = accept(tokens, "FROM")
		let src = word(tokens)
		let joins = []

		if (!pharse || !src)
			return null

		let tmp = join(tokens)
		while (tmp) {
			joins.push(tmp)
			tmp = join(tokens)
		}

		CMD["dataSources"] = {
			src: src,
			joins: joins
		}

		return CMD["dataSources"]
	}

	//where         =  "WHERE ", value-test ;
	function where(tokens) {
		const pharse = accept(tokens, "WHERE")

		if (!pharse)
			return

		let valTest = valueTest(tokens)

		if (!valTest)
			return null

		CMD["where"] = valTest

		return valTest
	}

	//query         =  select, ws, from, [ ws, join ], [ ws, where ] ;
	function query(tokens) {
		const sel = select(tokens)
		const fr = from(tokens)
		const wh = where(tokens)

		if (sel && fr && wh)
			return true

		return false
	}


	function transformKey(obj, namespace) {
		return Object.keys(obj).reduce((res, key) => {
			res[namespace + '.' + key] = obj[key]
			return res
		}, {})
	}

	function trimKey(obj, keys) {
		return Object.keys(obj).reduce((res, key) => {
			if (keys.indexOf(key) != -1)
				res[key] = obj[key]
			return res
		}, {})
	}

	function cmpValue(val1, val2, cmp) {
		if (cmp == '=')
			return val1 == val2
		else if (cmp == '>=')
			return val1 >= val2
		else if (cmp == '<=')
			return val1 <= val2
		else if (cmp == '>')
			return val1 > val2
		else if (cmp == '<')
			return val1 < val2
		else if (cmp == '<>')
			return val1 != val2
	}

	function doJoin(srcItm, joinData) {
		let srcField = joinData.con[0].join('.')
		let extField = joinData.con[2].join('.')
		const compare = joinData.con[1]

		if (joinData.con[0][0] == joinData.src) {
			let tmp = srcField
			srcField = extField
			extField = tmp
		}

		return database[joinData.src]
			.map(itm => transformKey(itm, joinData.src))
			.filter(itm => {
				return cmpValue(srcItm[srcField], itm[extField], compare)
			})
			.map(itm => Object.assign({}, srcItm, itm))
	}

	this.execute = function(sqlQuery) {
		CMD = {}
		const tokens = parseToken(sqlQuery)
		query(tokens)
		console.log(CMD)

		const joins = CMD["dataSources"].joins
		const srcTable = CMD["dataSources"].src
		const selectFields = CMD["select"].map(itm => itm.join('.'))
		const where = CMD["where"]
		
			//from
		CMD["data"] = database[srcTable]
			.map(itm => transformKey(itm, srcTable))

		//join
		CMD["data"] = joins.reduce((res, join) => {
			tmpRes = []
			res.forEach(itm => {
				tmpRes = tmpRes.concat(doJoin(itm, join))
			})
			return tmpRes
		}, CMD["data"])


		CMD["res"] = CMD["data"]

		//where
		if (where)
			CMD["res"] = CMD["res"].filter(itm => {
				return cmpValue(itm[CMD.where[0].join('.')], CMD.where[2], CMD.where[1])
			})

		//select
		CMD["res"] = CMD["res"].map(itm => trimKey(itm, selectFields))

		return CMD["res"]
	}

}



//--------------------------------------------//
var movieDatabase = {
	movie: [{
		id: 1,
		name: 'Avatar',
		directorID: 1
	}, {
		id: 2,
		name: 'Titanic',
		directorID: 1
	}, {
		id: 3,
		name: 'Infamous',
		directorID: 2
	}, {
		id: 4,
		name: 'Skyfall',
		directorID: 3
	}, {
		id: 5,
		name: 'Aliens',
		directorID: 1
	}],
	actor: [{
		id: 1,
		name: 'Leonardo DiCaprio'
	}, {
		id: 2,
		name: 'Sigourney Weaver'
	}, {
		id: 3,
		name: 'Daniel Craig'
	}, ],
	director: [{
		id: 1,
		name: 'James Cameron'
	}, {
		id: 2,
		name: 'Douglas McGrath'
	}, {
		id: 3,
		name: 'Sam Mendes'
	}],
	actor_to_movie: [{
		movieID: 1,
		actorID: 2
	}, {
		movieID: 2,
		actorID: 1
	}, {
		movieID: 3,
		actorID: 2
	}, {
		movieID: 3,
		actorID: 3
	}, {
		movieID: 4,
		actorID: 3
	}, {
		movieID: 5,
		actorID: 2
	}, ]
};
const tmp = new SQLEngine(movieDatabase)
	// console.log(tmp.execute('SELECT movie.name FROM movie'))
	// let test = 'SELECT movie.name, director.name ' + 'FROM movie ' + 'JOIN director ON director.id = movie.directorID'
	// console.log(tmp.execute(test))

// console.log(tmp.execute('SELECT movie.name, actor.name ' + 'FROM movie ' + 'JOIN actor_to_movie ON actor_to_movie.movieID = movie.id ' + 'JOIN actor ON actor_to_movie.actorID = actor.id ' + 'WHERE actor.name <> \'Daniel Craig\''))


console.log(tmp.execute(`SELECT movie.title FROM movie WHERE movie.title = 'Pirates of the Caribbean: Dead Man''s Chest' `))

//--------------------------------------------------------------------//
// EBNF 
//--------------------------------------------------------------------//
// query         =  select, ws, from, [ ws, join ], [ ws, where ] ;
// select        =  "SELECT ", column-id, [ { ", ", column-id } ] ;
// from          =  "FROM ", table-name, [ { ws, join } ] ;
// join          =  "JOIN ", table-name, " on ", value-test ;
// where         =  "WHERE ", value-test ;
// value-test    =  value, comparison, value;
// column-id     =  table-name, ".", column-name ;
// table-name    = ? a valid SQL table name ? ;
// column-name   = ? a valid SQL column name ? ;
// value         =  column-id | const
// comparison    =  " = " | " > " | " < " | " <= " | " >= " | " <> " ;
// const         =  ? a number ? | ? a SQL single-quoted string ? ;
// ws            = " " | "\n" | ws, ws ;