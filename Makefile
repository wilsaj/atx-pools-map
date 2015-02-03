all: data

data: pools-per-capita decks-per-capita

census: data/census/pop_total.geojson

decks: data/coa/decks_2013.geojson

pools: data/coa/pools_2013.geojson

pools-per-capita: data/processed/pools-per-capita.geojson
decks-per-capita: data/processed/decks-per-capita.geojson

%-per-capita: data/processed/%-per-capita.geojson

data/processed/%-per-capita.geojson: data/census/pop_total.geojson data/coa/%_2013.geojson
	mkdir -p $(dir $@)
	node perCapitaify.js $^ > $@

# Census data
data/census/reporter/extract/acs2013_5yr_B01003_15000US484530015043.zip:
	mkdir -p $(dir $@)
	curl 'http://api.censusreporter.org/1.0/data/download/latest?table_ids=B01003&geo_ids=05000US48453,04000US48,01000US,150|05000US48453&format=geojson' -o $@.download
	mv $@.download $@

data/census/reporter/extract/%.geojson:
	cd $(dir $@) && unzip $(notdir $<)
	mv $(dir $@)$(notdir $(basename $@))/$(notdir $@) $@
	rm -rf $(dir $@)/$(notdir $(basename $@))

data/census/reporter/extract/acs2013_5yr_B01003_15000US484530015043.geojson: data/census/reporter/extract/acs2013_5yr_B01003_15000US484530015043.zip

data/census/pop_total.geojson: data/census/reporter/extract/acs2013_5yr_B01003_15000US484530015043.geojson
	cat $<  | egrep -v '(United States|Travis County|Texas)' > $@


# City of Austin data
data/coa/%_2013.shp:
	rm -rf $(basename $@)
	mkdir -p $(basename $@)
	unzip -d $(basename $@) $<
	for file in $(basename $@)/*; do chmod 644 $$file; mv $$file $(basename $@).$${file##*.}; done
	rmdir $(basename $@)
	touch $@

data/coa/%.geojson:
	ogr2ogr -f GeoJSON -t_srs crs:84 $@ $<

data/coa/%.zip:
	mkdir -p $(dir $@)
	curl 'ftp://ftp.ci.austin.tx.us/GIS-Data/Regional/regional/$(notdir $@)' -o $@.download
	mv $@.download $@

data/coa/decks_2013.shp: data/coa/decks_2013.zip
data/coa/pools_2013.shp: data/coa/pools_2013.zip

data/coa/pools_2013.geojson: data/coa/pools_2013.shp
data/coa/decks_2013.geojson: data/coa/decks_2013.shp
