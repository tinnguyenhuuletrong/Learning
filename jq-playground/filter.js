const filter = `
# strip first two container levels
.content.data 
 
# strip out all extraneous hit sources outside our search criteria
| .hits[].doc.source_notes 
	|= map(
    if ( .aml_types 
    	| any(startswith("pep") or startswith("warn") or startswith("sanc"))
  	)
      then .
      else empty
    end 
  )
 
# remove associated organisations, we just want people
| del(.hits[] | select(.doc.entity_type != "person"))
 
# sometimes whitelisted results come back, sometimes not...
| del(.hits[] | select(.is_whitelisted == true))
 
# we only want current risk-list hits
| del(.hits[].doc.source_notes[] | select( has("listing_ended_utc")))
 
# provide a summary array of all (remaining) risk-list classes
| .hits[].doc |= . + { aml_types: [(.source_notes[].aml_types[])] | unique }
 
# single risk reason is sufficient for grouping risk-list names
| .hits[].doc.source_notes[] |= { aml_type: .aml_types[0], name }
 
# gather risk-list names into aml_risk category objects
| .hits[].doc.source_notes |= ( 
	group_by(.aml_type) 
	| map({"key": .[0].aml_type, "value": map(.name)}) 
	| from_entries 
)
 
# group by match_status (review outcome)
| .hits |= (
	group_by(.match_status)
	| map({"key": (.[0].match_status + "s"), "value": .}) 
	| from_entries
) 
 
# flatten docs sub-object into hit object
| .hits[][] |= .doc + .
| del(.hits[][].doc)
 
## trim objects to the properties we actually want in certs
| .hits[] |= map(
    if ( .match_status != "true_positive"  )
      then { id, entity_type, score, match_types }
      else { id, name, entity_type, aml_types, sources: .source_notes, score, match_types}
    end 
  )
 
# trim the container + meta info
| .filters |= { types, exact_match, fuzziness } 
| . |= { filters, hits } 
 
| .
`

module.exports = filter
