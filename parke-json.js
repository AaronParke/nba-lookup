var parke_json = {"cumulativeplayerstats": {"playerstatsentry": [{
	"player": {
		"ID": "parke",
		"LastName": "Parke",
		"FirstName": "Aaron",
		"JerseyNumber": "24",
		"Position": "SF"
	},
	"team": {
		"City": "St. Louis",
		"Name": "Flyers",
		"Abbreviation": "STL"
	},
	"stats": {
		"GamesPlayed": {
			"@abbreviation": "GP",
			"#text": "82"
		},
		"Fg3PtPct": {
			"@category": "Field Goals",
			"@abbreviation": "3P%",
			"#text": "62.0"
		},
		"FgPct": {
			"@category": "Field Goals",
			"@abbreviation": "FG%",
			"#text": "88.4"
		},
		"RebPerGame": {
			"@category": "Rebounds",
			"@abbreviation": "REB/G",
			"#text": "18.6"
		},
		"AstPerGame": {
			"@category": "Offense",
			"@abbreviation": "AST/G",
			"#text": "13.1"
		},
		"PtsPerGame": {
			"@category": "Offense",
			"@abbreviation": "PTS/G",
			"#text": "38.9"
		},
		"StlPerGame": {
			"@category": "Defense",
			"@abbreviation": "STL/G",
			"#text": "4.8"
		},
		"BlkPerGame": {
			"@category": "Defense",
			"@abbreviation": "BS/G",
			"#text": "6.2"
		},
		"PlusMinusPerGame": {
			"@category": "Miscellaneous",
			"@abbreviation": "+/-/G",
			"#text": "28.8"
		},
		"MinSecondsPerGame": {
			"@category": "Miscellaneous",
			"@abbreviation": "MIN/G",
			"#text": "2580"
		}
	}
}]}},

	parke_json_autcomplete = {"player": {
			"ID": "parke",
			"LastName": "Parke",
			"FirstName": "Aaron",
			"JerseyNumber": "24",
			"Position": "SF",
		}};



module.exports = parke_json;
module.exports.autocomplete = parke_json_autcomplete;