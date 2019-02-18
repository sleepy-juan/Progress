import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';

import WebHeader from '../components/Header';
import Projects from '../components/Projects';

class Home extends Component {
    constructor(props){
        super(props);

        this.state = {
            username: null,
        }
    }

    render() {
        var showname = this.props.match.params.username;
        if(!showname && this.state.username){
            window.location = "/users/" + this.state.username;
            showname = this.state.username;
        }

        return (
            <div>
                <WebHeader _onLoggedIn={user => { this.setState({username: user.profile.username}); }} _onLoggedOut={() => this.setState({username: null})} />
                {showname ? 
                    <Projects username={this.state.username} showname={showname}/> 
                    : <Message warning style={{margin: "300px", marginTop: "100px"}}>Sign in to see your project OR Search other users</Message>
                }
            </div>
        );
    }
}

export default Home;
