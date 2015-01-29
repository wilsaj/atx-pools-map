all: data

data: census decks pools

census: census_tracts data/census/all_140_in_48.P1.csv

decks: data/coa/decks_2013.shp

pools: data/coa/pools_2013.shp


# Census data
census_tracts: data/census/tx_tracts.shp

data/census/tl_2012_48_tract.zip:
	mkdir -p $(dir $@)
	curl 'http://www2.census.gov/geo/tiger/TIGER2012/TRACT/$(notdir $@)' -o $@.download
	mv $@.download $@

data/census/tx_tracts.shp data/coa/%_2013.shp:
	rm -rf $(basename $@)
	mkdir -p $(basename $@)
	unzip -d $(basename $@) $<
	for file in $(basename $@)/*; do chmod 644 $$file; mv $$file $(basename $@).$${file##*.}; done
	rmdir $(basename $@)
	touch $@

data/census/all_140_in_48.P1.csv:
	mkdir -p $(dir $@)
	curl 'http://censusdata.ire.org/48/$(notdir $@)' -o $@.download
	mv $@.download $@


# City of Austin data
data/coa/%.zip:
	mkdir -p $(dir $@)
	curl 'ftp://ftp.ci.austin.tx.us/GIS-Data/Regional/regional/$(notdir $@)' -o $@.download
	mv $@.download $@

data/census/tx_tracts.shp: data/census/tl_2012_48_tract.zip
data/coa/decks_2013.shp: data/coa/decks_2013.zip
data/coa/pools_2013.shp: data/coa/pools_2013.zip
