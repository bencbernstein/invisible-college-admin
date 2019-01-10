import * as React from "react"
// @ts-ignore
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react"

interface Props {
  addresses: any
}

const mapStyles = {
  width: "100%",
  height: "90VH"
}

interface State {
  showingInfoWindow: boolean
  activeMarker: any
  selectedPlace: any
}

export class MapContainer extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      showingInfoWindow: false,
      activeMarker: [],
      selectedPlace: []
    }
  }

  // @ts-ignore
  public onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })

  // @ts-ignore
  public onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }

  public makeMarkers(address: any) {
    const addressName = "address"
    const context = "context"
    const geocode = "geocode"
    return (
      <Marker
        // TODO: figure out why this isn't working.. somehow add listener at initiliazation?
        onMouseEnter={() => {
          console.log("mouse entered marker")
        }}
        position={address[geocode]}
        onClick={this.onMarkerClick}
        name={address[addressName]}
        context={address[context]}
      />
    )
  }
  public render() {
    console.log("this.props.addresses", this.props.addresses)
    return (
      <Map
        // @ts-ignore
        google={this.props.google}
        zoom={12}
        style={mapStyles}
        styles={silverMapStyle}
        initialCenter={{ lat: 40.7552901, lng: -73.9779346 }}
      >
        {this.props.addresses.map((address: any) => this.makeMarkers(address))}

        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div
            style={{
              fontFamily: "Brandon Grotesque !important",
              margin: "0px auto"
            }}
          >
            <h4>{this.state.selectedPlace.name}</h4>
            <span>{this.state.selectedPlace.context}</span>
          </div>
        </InfoWindow>
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAJpAchVrrwzPkiN56oh-OkMHTb-vvHsbk"
})(MapContainer)

const silverMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }]
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }]
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }]
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f5f5f5" }]
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#bdbdbd" }]
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#eeeeee" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#e5e5e5" }]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }]
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#dadada" }]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }]
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }]
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#e5e5e5" }]
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#eeeeee" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c9c9c9" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }]
  }
]
