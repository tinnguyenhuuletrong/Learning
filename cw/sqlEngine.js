const CMD = {}

function parseToken(queryString) {
	return queryString.match(/SELECT|FROM|JOIN|WHERE|ON|,|[A-z0-9_]+|\.|<=|>=|>|<|=/gm)
}

function accept(tokens, sym) {
	return (tokens[0].toLocaleLowerCase() == sym.toLocaleLowerCase()) && tokens.shift()
}

function word(tokens) {
	return /^[A-z][A-z0-9_]+/.test(tokens[0]) && tokens.shift()
}

function isNumber(tokens) {
	return !isNaN(tokens[0]) && tokens.shift()
}

function comparison(tokens) {
	return /<=|>=|>|<|=/.test(tokens[0]) && tokens.shift()
}

//column-id     =  word, ".", word ;
function columnId(tokens) {
	const word1 = word(tokens)
	const dot = accept(tokens, '.')
	const word2 = word(tokens)
	if (word1 && dot && word2) {
		return (word1 + dot + word2)
	}

	return null
}

function isConst(tokens) {
	let res = null;
	[isNumber].some(test => {
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

	if(!sel || !colId)
		return null

	let res = [colId]
	while(accept(tokens, ',')) {
		let tmp = columnId(tokens)
		res.push(tmp)
	}

	CMD["select"] = res
	return res
}

//join          =  "JOIN ", table-name, " on ", value-test ;
function join(tokens) {
	const pharse = accept(tokens, "JOIN")

	if(!pharse)
		return null

	const tbSrc = word(tokens)
	const keyWord = accept(tokens, "ON")
	const con = valueTest(tokens)

	if(pharse && tbSrc && keyWord && con)
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

	if(!pharse || !src)
		return null

	let tmp = join(tokens)
	while(tmp) {
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
	let valTest = valueTest(tokens)

	if(!pharse || !valTest)
		return null

	CMD["where"] = valTest

	return valTest
}

//--------------------------------------------//
let test = `SELECT movies.title, actors.name
FROM movies
JOIN actors_in_movies ON actors_in_movies.movieID = movies.ID
JOIN actors ON actors_in_movies.actorID = actors.ID
WHERE movies.cert <= 15
`

const tokens = parseToken(test)
select(tokens)
from(tokens)
where(tokens)
console.log(CMD)