/* eslint-disable */
import React, {Component} from "react";
import axios from "axios";
import PropTypes from "prop-types";

const apiKey = "7e35ea37110806c7b4fe6267662f21f4";
const tags = "dog";
const jsonRequest = "http://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=" + apiKey + "&tags=" + tags + "&format=json&nojsoncallback=true";

const DogCard = (props) => {
    let title = props.title;
    if (typeof title === "undefined" || title === "") {
        title = '-'
    }
    return (
        <div className="dog-card" style={{margin: "1rem"}}>
            <img src={props.url} />
            <div style={{marginLeft: "20px"}}>
                <div><strong>Title: </strong>{title}</div>
                <div><strong>Author ID: </strong><a href={"https://www.flickr.com/photos/" + props.owner + "/"}>{props.owner}</a></div>
            </div>
        </div>
    );
};

DogCard.propTypes = {
    title: PropTypes.string,
    url: PropTypes.string,
    owner: PropTypes.string,
};

class DogList extends React.Component {
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
            const listItems = items.photos.photo.map((item,i) => {
                return <DogCard owner={item.owner} key={i}
                    url={"https://farm" + item.farm + ".staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + ".jpg"}
                    title={item.title} />;
            });

            return <div>{listItems} </div>;
        }
    }
}

export default class App extends Component {
    render () {
        return <DogList />;
    }
}
