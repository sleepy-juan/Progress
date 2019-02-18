import React, { Component } from 'react';
import { Segment, Progress, Header, Container, Button, Message } from 'semantic-ui-react';
import { ProjectDB } from '../utils/Database';

class Projects extends Component {
    state = {
        projects: []
    }

    componentWillMount(){
        if(this.props.showname){
            ProjectDB.getJSON([])
            .then(projects => {
                if(projects){
                    projects = projects.filter(project => this.props.showname && project.owner === this.props.showname);
                    this.setState({projects});
                }
            });
        }
    }
    
    _onAdd(){
        ProjectDB.getJSON([])
        .then(projects => {
            ProjectDB.get(projects.length).putJSON({
                id: projects.length,
                owner: this.props.showname,
                title: "Name the Project",
                percentage: 0,
                members: [this.props.showname],
                description: "Explain your project"
            })
            .then(res => {
                window.location = '/projects/' + projects.length;
            });
        });
    }

    _calculatePercentage(project){
        if(!project) return 0;
        var options = project.options;
        if(!options) return 0;
        var length = options.length;
        var percentage = 0;
        options.forEach(option => {
            var suboptions = option.suboptions;
            if(suboptions){
                var quntum_percentage = 100 / length / suboptions.length;
    
                suboptions.forEach(suboption => {
                    if(suboption.done){
                        percentage += quntum_percentage;
                    }
                });
            }
        });

        return percentage.toFixed(2);
    }

    render() {
        if(!this.state.projects){
            return (
                <Message warning style={{margin: "300px", marginTop: "100px"}}>Invalid Username</Message>
            )
        }

        return (
            <Segment.Group style={{margin: "300px", marginTop: "100px"}}>
                {
                    this.state.projects.map((project, i) => {
                        var members = project.members.filter(member => member !== this.props.username);
                        members = members.map(member => '@'+member);
                        var members_str = 'with ';
                        if(members.length === 0){
                            members_str = 'You alone';
                        }
                        else if(members.length === 1){
                            members_str += members[0];
                        }
                        else if(members.length === 2){
                            members_str += members[0] + ' and ' + members[1];
                        }
                        else{
                            members_str += members[0] + ', ' + members[1] + ' and ' + (members.length - 2) + ' other(s)';
                        }

                        return (
                            this.props.username === this.props.showname && this.props.username ?
                            <Segment key={i} onClick={() => {window.location = '/projects/' + project.id}} style={{cursor: "pointer"}}>
                                <Header>{project.title}</Header>
                                <Progress percent={this._calculatePercentage(project)} indicating style={{marginTop: "20px", marginBottom: "20px"}}/>
                                {members_str ? <p align='right'>{members_str}</p> : null}
                            </Segment> : 
                            <Segment key={i}>
                                <Header>{project.title}</Header>
                                <Progress percent={this._calculatePercentage(project)} indicating style={{marginTop: "20px", marginBottom: "20px"}}/>
                                {members_str ? <p align='right'>{members_str}</p> : null}
                            </Segment>
                        )
                    })
                }
                {
                    this.props.username === this.props.showname && this.props.username ?
                    <Segment style={{padding: "60px"}}>
                        <Container textAlign='center'>
                            <Button onClick={this._onAdd.bind(this)} circular icon="add" size='massive'/>
                        </Container>
                    </Segment> : null 
                }
            </Segment.Group>
        );
    }
}

export default Projects;
