/* eslint-disable */
import React, {Component} from "react";
import axios from "axios";
import PropTypes from "prop-types";

const apiKey = "7e35ea37110806c7b4fe6267662f21f4";
const tags = "dog";
const apiConfigParams = {
    method: "flickr.photos.search",
    api_key: apiKey,
    tags: tags,
    format: "json",
    nojsoncallback: "true",
    extras: "description, owner_name, date_taken"
};
const apiLink = "http://api.flickr.com/services/rest/";
const apiParams = Object.keys(apiConfigParams).map(key => key + '=' + apiConfigParams[key]).join('&');
const jsonRequest = apiLink + "?" + apiParams;
const PhotoCard = (props) => {
    const checkIfEmpty = text => {
        if (typeof text === "undefined" || text === "") {
            return '-'
        } else {
            return text;
        }
    };

    return (
        <div className="photo-card">
            <img src={props.url} />
            <div>
                <p><strong>Title: </strong><span className="photo-title">{checkIfEmpty(props.title)}</span></p>
                <p><strong>Author: </strong><a href={"https://www.flickr.com/photos/" + props.ownerId } title="author's other pictures">{props.ownerName}</a></p>
                <p><strong>Description: </strong>{checkIfEmpty(props.description)}</p>
                <p><strong>Taken: </strong>{props.dateTaken}</p>
            </div>
        </div>
    );
};

PhotoCard.propTypes = {
    title: PropTypes.string,
    url: PropTypes.string,
    description: PropTypes.string,
    ownerId: PropTypes.string,
    ownerName: PropTypes.string,
};

class PhotoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        axios.get(jsonRequest)
            .then(
                result => {
                    this.setState({
                        isLoaded: true,
                        items: result.data
                    });
                    console.log(result.data);
                }, error => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                });
    }

    render() {
        const {error, isLoaded, items} = this.state;

        if (error) {
            return <div>Error: {error} </div>;
        } else if (!isLoaded) {
            return <div>loading...</div>;
        } else {
            const listItems = items.photos.photo.map((photo,i) => {
                return <PhotoCard key={i}
                    dateTaken={photo.datetaken}
                    description={photo.description._content}
                    ownerName={photo.ownername}
                    ownerId={photo.owner}
                    url={"https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg"}
                    title={photo.title} />;
            });

            return <div>{listItems} </div>;
        }
    }
}

export default class App extends Component {
    render () {
        return (
            <div className="photo-gallery">
                <h1>Photos tagged as: {tags}</h1>
                <PhotoList />
            </div>
        );
    }
}
