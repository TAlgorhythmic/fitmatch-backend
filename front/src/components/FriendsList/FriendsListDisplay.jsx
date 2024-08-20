import { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';

function FriendsList() {

    const {data} = props;

    return (
        <div className="FriendsList">
            <h1>{data.name}</h1>
        </div>)
}

export default FriendsList;