import React, { Component } from "react";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import Form from "./Form";

const UsersQuery = gql`
  {
    users {
      id
      username
      email
      checkAdmin
    }
  }
`;

const UpdateMutation = gql`
  mutation($id: ID!, $checkAdmin: Boolean!) {
    updateUser(id: $id, checkAdmin: $checkAdmin)
  }
`;

const RemoveMutation = gql`
  mutation($id: ID!) {
    removeUser(id: $id)
  }
`;

const CreateUserMutation = gql`
  mutation($username: String!, $email: String!, $checkAdmin:Boolean!) {
    createUser(username: $username, email: $email, checkAdmin: $checkAdmin) {
      id
      username
      email
      checkAdmin
    }
  }
`;

class App extends Component {
  updateUser = async user => {
    // update user
    await this.props.updateUser({
      variables: {
        id: user.id,
        checkAdmin: !user.checkAdmin
      },
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: UsersQuery });
        // Add our comment from the mutation to the end.
        data.users = data.users.map(
          x =>
            x.id === user.id
              ? {
                  ...user,
                  checkAdmin: !user.checkAdmin
                }
              : x
        );
        // Write our data back to the cache.
        store.writeQuery({ query: UsersQuery, data });
      }
    });
  };

  removeUser = async user => {
    // remove user
    await this.props.removeUser({
      variables: {
        id: user.id
      },
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: UsersQuery });
        // Add our comment from the mutation to the end.
        data.users = data.users.filter(x => x.id !== user.id);
        // Write our data back to the cache.
        store.writeQuery({ query: UsersQuery, data });
      }
    });
  };

  createUser = async (username, email, checkAdmin)  => {
    // create user
    await this.props.createUser({
      variables: {
        username,
        email, 
        checkAdmin
      },
      update: (store, { data: { createUser } }) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: UsersQuery });
        // Add our comment from the mutation to the end.
        data.users.unshift(createUser);
        // Write our data back to the cache.
        store.writeQuery({ query: UsersQuery, data });
      }
    });
  };

  render() {
    const {
      data: { loading, users }
    } = this.props;
    if (loading) {
      return null;
    }

    return (
      <div style={{ display: "flex" }}>
        <div style={{ margin: "auto", width: 400 }}>
          <Paper elevation={1}>
            <Form submit={this.createUser} />
            <List>
              {users.map(user => (
                <ListItem
                  key={user.id}
                  role={undefined}
                  dense
                  button
                  onClick={() => this.updateUser(user)}
                >
                  <Checkbox
                    checked={user.checkAdmin}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={user.email} />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => this.removeUser(user)}>
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(CreateUserMutation, { name: "createUser" }),
  graphql(RemoveMutation, { name: "removeUser" }),
  graphql(UpdateMutation, { name: "updateUser" }),
  graphql(UsersQuery)
)(App);
