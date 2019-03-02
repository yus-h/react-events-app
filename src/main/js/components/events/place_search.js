import React from 'react'
import scriptLoader from 'react-async-script-loader'
import Autocomplete from 'react-google-autocomplete';

class PlaceSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchType: props.searchType,
            address: '',
            geocodeResults: null,
            loading: false,
            apiLoaded: false,
            lat: 52.947150,
            lng: -1.147053,
            placeholder: "Enter a location..."
        }

        this.locationSelected = this.locationSelected.bind(this);

    }

    componentWillReceiveProps({isScriptLoaded, isScriptLoadSucceed}) {
        // async load finished
        if (isScriptLoaded && !this.props.isScriptLoaded) {
            if (isScriptLoadSucceed) {
                this.setState({apiLoaded: true});
            } else {
                console.log("Script load failed");
            }
        }

        this.setState(
            {
                placeholder: this.props.searchPlaceholder
            }
        );

    }


    locationSelected(place) {
        this.setState({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address
        });

        this.props.onSearchLocationChange(place.geometry.location.lat(), place.geometry.location.lng(), place.formatted_address);
    }


    /**
     * Home page search type: {['(cities)']}
     * Add new event search type: {['geocode']}
     *
     * @returns {XML}
     */
    render() {
        if (this.state.apiLoaded == false) {
            return ( <div>Loading..</div>);
        }
        return (
            <div className="page-wrapper">
                <Autocomplete
                    style={{width: '90%'}}
                    onPlaceSelected={this.locationSelected}
                    types={this.state.searchType}
                    componentRestrictions={{country: "uk"}}
                    placeholder = {this.state.placeholder}
                />

            </div>
        )
    }

}


export default PlaceSearch
// export default scriptLoader(
//     [
//         [INSERT GOOGLE MAPS API URL KEY HERE]
//     ]
// )(PlaceSearch)
