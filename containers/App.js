import React, {Component} from "react";
import PropTypes from "prop-types";
import axios from "axios";

class Gallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            giveMorePhotos: false,
            tags: props.tags,
            onlyGeo: false,
        };
        this.handleScroll = this.handleScroll.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll() {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= documentHeight) {
            if (!this.state.giveMorePhotos) {
                this.setState({
                    giveMorePhotos: true
                });
            }
        } else {
            if (this.state.giveMorePhotos) {
                this.setState({
                    giveMorePhotos: false
                });
            }
        }
    }

    handleChange(event) {
        this.setState({
            tags: event.target.value
        });
    }

    handleCheck() {
        this.setState({
            onlyGeo: !this.state.onlyGeo}
        );
    }

    render() {
        /*limit photos showed to make loading smoother*/
        let photosBundleLimit = 5;
        if (this.state.onlyGeo) {
            photosBundleLimit = 2;
        }
        return (
            <div className="gallery">
                <h1>Flickr Photo Search</h1>
                <div className="gallery-title">
                    Search for photos tagged as: <input type="text" name="title" value={this.state.tags} onChange={this.handleChange.bind(this)}/>
                    <input type="checkbox" onChange={this.handleCheck} defaultChecked={this.state.onlyGeo}/><span>only images with geolocation</span>
                </div>
                <PhotosList tags={this.state.tags} giveMorePhotos={this.state.giveMorePhotos} limit={photosBundleLimit} onlyGeo={this.state.onlyGeo} />
            </div>
        );
    }
}

class PhotosList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: props.tags,
            limit: props.limit,
            onlyGeo: props.onlyGeo,
            giveMorePhotos: props.giveMorePhotos,
            requestError: null,
            isLoaded: false,
            items: []
        };
    }

    requestPhotos() {
        const apiKey = "7e35ea37110806c7b4fe6267662f21f4";
        const apiLink = "http://api.flickr.com/services/rest/";
        let tags = this.state.tags;
        if (tags !== "") {
            tags = tags.replace(/\s+/,",").replace(/,+/,",");
        }
        let apiConfigParams = {
            method: "flickr.photos.search",
            api_key: apiKey,
            tags: tags,
            extras: "description,owner_name,date_taken,geo",
            format: "json",
            nojsoncallback: "true",
        };
        if (this.state.onlyGeo) {
            apiConfigParams["has_geo"]= true;
        }
        const apiParams = Object.keys(apiConfigParams).map(key => `${key}=${apiConfigParams[key]}`).join("&");
        const jsonRequest = `${apiLink}?${apiParams}`;
        axios.get(jsonRequest)
            .then(
                result => {
                    this.setState({
                        isLoaded: true,
                        items: result.data
                    });
                }, error => {
                    this.setState({
                        isLoaded: true,
                        requestError: error
                    });
                });
    }

    componentDidUpdate() {
        if (this.state.tags !== this.props.tags || this.state.onlyGeo !== this.props.onlyGeo) {
            this.setState({
                limit: this.props.limit,
                isLoaded: false,
                tags: this.props.tags,
                onlyGeo: this.props.onlyGeo,
            }, () => this.requestPhotos());
        } else if (this.state.giveMorePhotos !== this.props.giveMorePhotos ) {
            this.setState({
                giveMorePhotos: this.props.giveMorePhotos,
                limit: (parseInt(this.state.limit) + parseInt(this.props.limit))
            });
        }
    }

    componentDidMount() {
        this.requestPhotos();
    }

    returnError(error) {
        /* eslint-disable no-console*/
        console.log(`ERROR: ${error}`);
        /* eslint-enable no-console*/

        return <div>Error: {error} </div>;
    }

    render() {
        const {requestError, isLoaded, items} = this.state;
        try {
            if (requestError) {
                return this.returnError(requestError);
            } else if (!isLoaded) {
                return <div>loading...</div>;
            } else if (items.stat === "fail") {
                if (items.code === 3) {
                    return <div>Please provide at least one tag.</div>;
                } else {
                    return this.returnError(items.message);
                }
            } else if (typeof items.photos === "undefined" || items.photos.photo.length === 0) {
                return <div>No photos found.</div>;
            } else {
                const listItems = items.photos.photo.slice(0, this.state.limit).map((photo,i) => {
                    return <PhotoCard key={i}
                        dateTaken={photo.datetaken}
                        description={photo.description._content}
                        ownerName={photo.ownername}
                        ownerId={photo.owner}
                        url={`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`}
                        title={photo.title}
                        latitude={photo.latitude.toString()}
                        longitude={photo.longitude.toString()} />;
                });
                return <div>{listItems}</div>;
            }
        } catch (error) {
            return this.returnError(error.toString());
        }
    }
}

const GoogleMap = (props) => {
    if (props.latitude !== "0" && props.longitude !== "0") {
        return <iframe width="300" height="150" frameBorder="0"
            src={`https://maps.google.com/maps?q=${props.latitude},${props.longitude}&z=14&output=embed`}></iframe>;
    } else {
        return null;
    }
};

const PhotoCard = (props) => {
    const checkIfEmpty = text => {
        if (typeof text === "undefined" || text === "") {
            return "-";
        } else {
            return text;
        }
    };

    return (
        <div className="photo-card">
            <img src={props.url} />
            <div>
                <p><strong>Title: </strong><span className="photo-title">{checkIfEmpty(props.title)}</span></p>
                <p><strong>Author: </strong><a href={`https://www.flickr.com/photos/${props.ownerId}`} title="author's other pictures">{props.ownerName}</a></p>
                <p><strong>Description: </strong>{checkIfEmpty(props.description)}</p>
                <p><strong>Taken: </strong>{props.dateTaken}</p>
                <GoogleMap latitude={props.latitude} longitude={props.longitude} />
            </div>
        </div>
    );
};

Gallery.propTypes = {
    tags: PropTypes.string,
};

PhotosList.propTypes = {
    tags: PropTypes.string,
    giveMorePhotos: PropTypes.bool,
    limit: PropTypes.number,
    onlyGeo: PropTypes.bool
};

PhotoCard.propTypes = {
    title: PropTypes.string,
    url: PropTypes.string,
    dateTaken: PropTypes.string,
    description: PropTypes.string,
    ownerId: PropTypes.string,
    ownerName: PropTypes.string,
    latitude: PropTypes.string,
    longitude: PropTypes.string,
};

export default class App extends Component {
    render () {
        return (
            <Gallery tags="dog" />
        );
    }
}
