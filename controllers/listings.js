const Listing = require("../models/listing");


// Geocoding function using OpenStreetMap Nominatim API
const geocodeAddress = async (location, country) => {
    try {
        const fullAddress = country ? `${location}, ${country}` : location;

        console.log(`🌍 Geocoding: ${fullAddress}`);

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`,
            {
                headers: {
                    "User-Agent": "MyAirbnbProject/1.0 (pritampadhan3107@gmail.com)",
                    "Accept-Language": "en"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.status}`);
        }

        const data = await response.json();  // ← This will work now

        if (data && data.length > 0) {
            const result = data[0];

            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);

            if (isNaN(lat) || isNaN(lng)) return null;

            console.log(`Geocoding Success: ${result.display_name}`);

            return {
                latitude: lat,
                longitude: lng,
                formattedAddress: result.display_name
            };
        }

        console.warn(`No results found for: ${fullAddress}`);
        return null;

    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
};

const getAlternativeCoordinates = async (location, country) => {
    try {
        const searches = [
            `${location}, ${country}`,
            location,
            `${location} city`,
            `${location} town`
        ];

        for (let searchTerm of searches) {

            const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(searchTerm)}`;

            const response = await fetch(url, {
                headers: {
                    "User-Agent": "Airbnb-Clone-Project/1.0 (your-email@example.com)"
                }
            });

            const data = await response.json();

            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);

                if (!isNaN(lat) && !isNaN(lng)) {
                    console.log(`Alternative found with: ${searchTerm}`);
                    return { latitude: lat, longitude: lng };
                }
            }
        }
        return null;

    } catch (error) {
        console.error('Alternative geocoding error:', error);
        return null;
    }
};




//"index route" ka callback, this function Render the all Listing---->>>
module.exports
.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

//New & Create Route (for a Form):
//"New Route" ka callback function------>
module.exports
.RenderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

//(CRUD are using on Routes):
//"Show Route" ka callback funtion ------>
module.exports
.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },  
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

//"create Route" ka callback function----->
// createListing - HAR LISTING KE LIYE EXACT COORDINATES
module.exports.createListing = async (req, res, next) => {
    try {
        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };

        const { location, country } = req.body.listing;

        console.log(`Processing listing: ${location}, ${country}`);

        if (location && country) {
            const coordinates = await geocodeAddress(location, country);

            if (coordinates) {
                newListing.coordinates = {
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude
                };
                newListing.formattedAddress = coordinates.formattedAddress;

                console.log('EXACT COORDINATES SAVED:');
                console.log('   Latitude:', coordinates.latitude);
                console.log('   Longitude:', coordinates.longitude);
            } else {
                console.warn('Geocoding failed, trying alternative...');

                const alternativeCoords = await getAlternativeCoordinates(location, country);

                if (alternativeCoords) {
                    newListing.coordinates = alternativeCoords;
                    newListing.formattedAddress = `${location}, ${country}`;
                    console.log('Alternative coordinates saved');
                } else {
                    newListing.coordinates = {
                        latitude: 20.5937,
                        longitude: 78.9629
                    };
                    newListing.formattedAddress = `${location}, ${country}`;
                    console.log('⚠️ Using fallback world coordinates');
                }
            }
        }

        await newListing.save();
        console.log('Listing created with coordinates:', newListing.coordinates);

        req.flash("success", "New Listing Created!");
        res.redirect("/listings");

    } catch (error) {
        console.error('Error creating listing:', error);
        req.flash("error", "Failed to create listing");
        res.redirect("/listings/new");
    }
};

//Update: Edit & Upadate Route (for a Form)----->
//"Edit Route" ka callback function ---->>>
module.exports
.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url; //img-preview
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

//"Update Route" ka callback function ----->
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    // Step 1: Basic update
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // Step 2: IMAGE update
    if (typeof req.file != "undefined") {
        listing.image = { 
            url: req.file.path, 
            filename: req.file.filename 
        };
    }

    // Step 3: LOCATION CHANGE → run fresh geocoding
    const { location, country } = req.body.listing;

    if (location && country) {
        console.log("Updating coordinates for edited listing...");

        const newCoordinates = await geocodeAddress(location, country);

        if (newCoordinates) {
            listing.coordinates = {
                latitude: newCoordinates.latitude,
                longitude: newCoordinates.longitude
            };
            listing.formattedAddress = newCoordinates.formattedAddress;

            console.log("Updated exact coordinates");
        } else {
            console.log("⚠️ Geocoding failed on update, keeping old coordinates");
        }
    }

    // Step 4: Save all changes
    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//Delete: "Delete Route" (for Button-Form) ka callback function ---->>>
module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;

    let deleteListing = await Listing.findByIdAndDelete(id);

    console.log(deleteListing);
    
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};