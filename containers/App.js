import React, {Component} from "react";
import PropTypes from "prop-types";

const DogCard = (props) => {
    return (
        <div className="dog-card" style={{margin: "1rem"}}>
            <img width="90" src={props.url} />
            <div style={{marginLeft: "20px"}}>
                <div style={{fontWeight: "bold"}}>{props.name}</div>
                <div>{props.owner}</div>
            </div>
        </div>
    );
};

DogCard.propTypes = {
    name: PropTypes.string,
    url: PropTypes.string,
    owner: PropTypes.string,
};

const DogList = () => {
    return (
        <div>
            <DogCard name="Fafik"
                url="http://placehold.it/90"
                owner="Paul"
            />
        </div>
    );
};

export default class App extends Component {
    render () {
        return <DogList />;
    }
}
