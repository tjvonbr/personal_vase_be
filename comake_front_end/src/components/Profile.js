import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import EditProfile from './EditProfile';
import { Card, Icon, Image, Table, Modal } from 'semantic-ui-react';
import EditIssue from './EditIssue';
import styled from 'styled-components';
import ProfileTable from './ProfileTable';
import ProfileCard from './ProfileCard';
import ProfileEditForm from './ProfileEditForm';


const Container = styled.div`
display: flex;
justify-content: center;

`
const Body = styled.div`
flex-direction: column;

`

const PCard = styled.div`
width: 500px;
`


function Profile(props) {
    const [currentUser, setCurrentUser] = useState("")
    const [isEditingUser, setIsEditingUser] = useState(false);
    const [isEditingIssue, setIsEditingIssue] = useState(false);
    const [issueToUpdate, setIssueToUpdate] = useState({})
    let token = JSON.parse(localStorage.getItem('token'))
    let localId = JSON.parse(localStorage.getItem('id'))

    useEffect(()=>{
        axios
           .get(`https://co-make.herokuapp.com/users/${localId}/issues`, {
              headers: {
                Authorization: token
              }
             })
            .then( res => {
            console.log("USER DATA FROM SERVER", res)
            setCurrentUser(res.data)
          })
            .catch( err => console.log("OH NO AN ERROR HAPPENED", err))
        },[])

        const handleEdit = e => {
          setIsEditingUser(!isEditingUser);
        };
        const handleEditIssue = id => {
          let thisIssue = currentUser.issues.filter( issue => issue.id === id);
          setIssueToUpdate(...thisIssue)
          setIsEditingIssue(!isEditingIssue)
        }

        const deleteIssue = id => {
          axios
            .delete(`https://co-make.herokuapp.com/issues/${id}`, {
              headers: {
                Authorization: token
              }
            })
            .then( res => {

              axios.get(`https://co-make.herokuapp.com/users/${localId}/issues`, {
                headers: {
                  Authorization: token
                }
               }).then( res => {
                 console.log("NEW DATA FROM SERVER", res)
                 setCurrentUser(res.data)
               }).catch( err => {
                 console.log("OH NO", err)
               })
            })
            .catch( err => {
              console.log("Error on delete", err)
            })

        }

    return (
      <>

        <Container>

      { isEditingUser ? (
        <EditProfile

            handleEdit={handleEdit}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
             />
        )
        : isEditingIssue ? (
          <EditIssue
          setCurrentUser={setCurrentUser}
          setIsEditingIssue={setIsEditingIssue}
          isEditingIssue={isEditingIssue}
          issueToUpdate={issueToUpdate}

          />
        )
        : (
          <Body>        

        <ProfileCard currentUser={currentUser} dog={handleEdit} image={currentUser.picture} />

        <ProfileTable currentUser={currentUser} handleEditIssue={handleEditIssue} deleteIssue={deleteIssue} />

        <Modal currentUser={currentUser} />
          </Body>

        //   <footer className="footer-nav">
        //   <Nav>
        //     {/* <img src={Logo} /> */}
        //     {/* <a href='https://flamboyant-mayer-055230.netlify.com/index.html'>Feed</a>
        //     <a href='https://flamboyant-mayer-055230.netlify.com/aboutus.html'>Create an Issue</a>
        //     <a href="#">Profile</a> */}
        //     <Button.Group widths="3" size="big">
        //       {/* <Link to="#"> */}
        //         <Button icon="list alternate outline"
        //                 content='Feed'
        //         />
        //       {/* </Link> */}
        //       {/* <Link to="/addIssue"> */}
        //         <Button icon="add" 
        //                 content='Create Issue'
        //         />
        //       {/* </Link> */}
        //       {/* <Link to="/profile/:id"> */}
        //         <Button icon="user" 
        //                 content='Profile'
        //         />
        //       {/* </Link> */}
        //     </Button.Group>
        //   </Nav>
        // </footer>

        )
        }
       </Container>
      </>
    )
  }

  export default Profile;

