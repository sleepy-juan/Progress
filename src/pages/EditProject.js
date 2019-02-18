import React, { Component } from 'react';
import WebHeader from '../components/Header';
import { ProjectDB } from '../utils/Database';
import { Message, Header, Progress, Divider, Segment, Container, Button, Modal, Input, Icon } from 'semantic-ui-react';

class EditProjects extends Component {
    state = {
        project: null,
        expand: {},
        modal_open: false,
        modal: {
            
        }
    }

    componentWillMount(){
        if(this.props.match.params.id){
            ProjectDB.get(this.props.match.params.id).getJSON(null)
            .then(project => {
                this.setState({
                    project,
                    id: this.props.match.params.id
                });
            });
        }
    }

    _subOption(suboptions, option_id){
        return (
            <div>
                <Divider />
                {
                    suboptions.map((suboption, i) => {
                        if(suboption.done){
                            return <p key={i}><del>{suboption.title}</del>{this._clickableText(', edit', ()=>{
                                this.setState({
                                    modal_open: true, 
                                    modal: {
                                        title: "Suboption Name",
                                        placeholder: suboption.title,
                                        index: option_id,
                                        subindex: i
                                    }
                                });
                            })}{this._clickableText(', undo', () => {
                                ProjectDB.get(this.state.id).get('options').get(option_id).get('suboptions').get(i).get('done').putJSON(false)
                                .then(()=>{
                                    var project = this.state.project;
                                    project.options[option_id].suboptions[i].done = false;
                                    this.setState({
                                        project
                                    })
                                })
                            })}</p>
                        }
                        return <p key={i}>{suboption.title}{this._clickableText(', edit', ()=>{
                            this.setState({
                                modal_open: true, 
                                modal: {
                                    title: "Suboption Name",
                                    placeholder: suboption.title,
                                    index: option_id,
                                    subindex: i
                                }
                            });
                        })}{this._clickableText(', do', () => {
                            ProjectDB.get(this.state.id).get('options').get(option_id).get('suboptions').get(i).get('done').putJSON(true)
                            .then(()=>{
                                var project = this.state.project;
                                project.options[option_id].suboptions[i].done = true;
                                this.setState({
                                    project
                                })
                            })
                        })}</p>
                    })
                }
            </div>
        )
    }

    _getFormattedMembers(owner, members){
        if(!members) return null;
        members = members.filter(member => member !== owner);
        members = members.map(member => '@'+member);
        var members_str = "You with ";
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

        return members_str;
    }

    _clickableText(text, what){
        return (
            <i 
                style={{cursor:"pointer", color:'blue'}} 
                onClick={e => {
                    if(what) what();
                    e.stopPropagation();
                }}
            >
                {text}
            </i>
        )
    }

    _calculatePercentage(project){
        if(!project) return 0;
        var options = project.options;
        if(!options) return 0;
        var length = options.length;
        var percentage = 0;
        options.forEach(option => {
            var suboptions = option.suboptions;
            var quntum_percentage = 100 / length / suboptions.length;

            suboptions.forEach(suboption => {
                if(suboption.done){
                    percentage += quntum_percentage;
                }
            });
        });

        return percentage.toFixed(2);
    }

    _onModalClicked(modal_title, option_id, suboption_id){
        if(this.modal_text && this.modal_text.length > 0){
            switch(modal_title){
            case "Project Name":
                ProjectDB.get(this.state.id).get('title').putJSON(this.modal_text)
                .then(()=>{
                    var project = this.state.project;
                    project.title = this.modal_text;
                    this.setState({
                        project,
                        modal_open: false
                    })
                })
            break;

            case "Description":
                ProjectDB.get(this.state.id).get('description').putJSON(this.modal_text)
                .then(()=>{
                    var project = this.state.project;
                    project.description = this.modal_text;
                    this.setState({
                        project,
                        modal_open: false
                    })
                })
            break;

            case "Option Name":
                ProjectDB.get(this.state.id).get('options').get(option_id).get('title').putJSON(this.modal_text)
                .then(()=>{
                    var project = this.state.project;
                    project.options[option_id].title = this.modal_text;
                    this.setState({
                        project,
                        modal_open: false
                    })
                })
            break;

            case "Suboption Name":
            ProjectDB.get(this.state.id).get('options').get(option_id).get('suboptions').get(suboption_id).get('title').putJSON(this.modal_text)
                .then(()=>{
                    var project = this.state.project;
                    project.options[option_id].suboptions[suboption_id].title = this.modal_text;
                    this.setState({
                        project,
                        modal_open: false
                    })
                })
            break;

            default:
            break;
            }
        }
    }

    render() {
        return (
            <div>
                <WebHeader _onLoggedIn={user => { this.setState({username: user.profile.username}); }} _onLoggedOut={() => this.setState({username: null})} />
                <Modal
                    open={this.state.modal_open}
                    closeOnEscape={true}
                    closeOnDimmerClick={true}
                    onClose={()=>{this.setState({modal_open: false})}}
                >
                    <Header>{this.state.modal.title}</Header>
                    <Modal.Content>
                        <Input onChange={(e, {value}) => {
                            this.modal_text = value;
                    }} fluid placeholder={this.state.modal.placeholder} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' onClick={()=>this.setState({modal_open: false})}>
                            <Icon name='remove' /> Cancel
                        </Button>
                        <Button color='green' onClick={()=>this._onModalClicked(this.state.modal.title, this.state.modal.index, this.state.modal.subindex)}>
                            <Icon name='checkmark' /> Change
                        </Button>
                    </Modal.Actions>
                </Modal>
                {this.state.project ? 
                    <div style={{margin: "300px", marginTop: "100px"}}>
                        <Header>
                            {this.state.project.title}{this._clickableText(", edit", ()=>{
                                this.setState({
                                    modal_open: true, 
                                    modal: {
                                        title: "Project Name",
                                        placeholder: this.state.project.title
                                    }
                                });
                            })}
                            <Header.Subheader>{this.state.project.description}{this._clickableText(", edit", ()=>{
                                this.setState({
                                    modal_open: true, 
                                    modal: {
                                        title: "Description",
                                        placeholder: this.state.project.description
                                    }
                                });
                            })}</Header.Subheader>
                        </Header>
                        <Progress percent={this._calculatePercentage(this.state.project)} indicating style={{marginTop: "20px", marginBottom: "20px"}}/>
                        <p align='right'>{this._getFormattedMembers(this.state.project.owner, this.state.project.members)}{this._clickableText(", edit")}</p>

                        <div style={{marginTop: "50px"}}>
                            {
                                this.state.project.options ? 
                                this.state.project.options.map((option, i) => {
                                    return (
                                        <Segment onClick={()=>{
                                            var expand = this.state.expand;
                                            expand[i] = !expand[i];
                                            this.setState({
                                                expand
                                            });
                                        }} key={i} style={{cursor: "pointer"}}>
                                            <Header>{option.title}{this._clickableText(", edit", ()=>{
                                                this.setState({
                                                    modal_open: true, 
                                                    modal: {
                                                        title: "Option Name",
                                                        placeholder: option.title,
                                                        index: i
                                                    }
                                                });
                                            })}</Header>
                                            <p>Due: {option.due}{this._clickableText(", edit")}</p>
                                            { this.state.expand[i] ? this._subOption(option.suboptions, i) : null }
                                        </Segment>
                                    )
                                }) : null
                            }
                            <Segment basic style={{padding: "30px"}}>
                                <Container textAlign='center'>
                                    <Button circular icon="add" size='massive'/>
                                </Container>
                            </Segment>
                        </div>
                    </div>
                    : <Message warning style={{margin: "300px", marginTop: "100px"}}>Invalid Project ID</Message>
                }
            </div>
        );
    }
}

export default EditProjects;