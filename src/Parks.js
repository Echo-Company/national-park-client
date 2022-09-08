import React from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import ParksList from './components/ParksList.js';
import Favorites from './components/Favorites.js';
import fifty from './data/states.json';
import activities from './data/activities.json';
import './parks.css';


class Parks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parkState: '',
      parkActivity: '',
      parks: [],
      favsParks: [] 
    }
  }

  handleState = (e) => {
    e.preventDefault();
    this.setState({
      parkState: e.target.value
    })
  };
  

  handleActivity = (e) => {
    e.preventDefault();
    this.setState({
      parkActivity: e.target.value
    })
  };
    
  getParkData = async (e) => {
    e.preventDefault();
             
    try {
          let parksUrl = `${process.env.REACT_APP_SERVER}/parks?state=${this.state.parkState}&activities=${this.state.parkActivity}`
          let parksResponse = await axios.get(parksUrl);
          
          this.setState({
            parks: parksResponse.data
          });
        
    } catch (err) {
        console.log(err);
      }
  }


  getFavs = async() => {
    try {
      let favsData = await axios.get(`${process.env.REACT_APP_SERVER}/favs`);
      
      this.setState({
        favsParks: favsData.data
      })

    } catch (error) {
      console.log('we have an error: ', error.response);
    }
  }



  handleFavsCreate = async(favsInfo) => {
    console.log('You are inside of handleFavsCreate')
    console.log('favsInfo', favsInfo);
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER}/favs`, favsInfo);
      const newFavs = response.data;
      this.setState({
        favsParks: [...this.state.favsParks, newFavs],
      });
    } catch (error) {
      console.log('error in favs post: ', error.response);
    }
  }

  favsHandleSubmit = (favsPark) => {
      console.log('favsPark', favsPark);
      this.handleFavsCreate({
      parks: favsPark.parks,
      description: favsPark.description,
      image: favsPark.image
    })
    
  }  
 
  handleDelete = async (favsToDelete) => {
    try {
    
      const response = await axios.delete(`${process.env.REACT_APP_SERVER}/favs/${favsToDelete._id}`);
      console.log(response.status);
      const filteredFavs = this.state.favsParks.filter(favs => {
        return favs._id !== favsToDelete._id;
      })
      this.setState({
        favsParks: filteredFavs
      })

    } catch (error) {
      console.log(error);
    }
  }
  
  // updateFavs = async(favsToUpdate) => {
  //   console.log('favsToUpdate', favsToUpdate);
  //   try {
  //     let url = `${process.env.REACT_APP_SERVER}/favs/${favsToUpdate._id}`
  //     let updatedFavs = await axios.put(url, favsToUpdate);
  //     console.log('url', url);
      
  //     let updatedFavsArray = this.state.favsParks.map(existingFavs => {
  //       return existingFavs._id === favsToUpdate._id
  //       ? updatedFavs.data
  //       : existingFavs
  //     });
  //     this.setState({favsParks: updatedFavsArray});
  //   } catch (error){
  //     console.log('error is favs post: ', error.response);
  //     }
  // }

  // handleUpdateSubmit = (event) => {
  //   event.preventDefault();
  //   console.log(event.target.idv, 'you are in handleUpdateSubmit');
  //   let favsToUpdate = {
  //     plannedVisit: event.target.plannedVisit.value,
  //     _id: event.target.idv._id,
  //     __v: event.target.idv.__v 
  //   }

  //   this.updateFavs(favsToUpdate);
  //   // this.handleUpdateClose();
  // }






  componentDidMount() {
    this.getFavs();
  }

 
  render() {
    
    console.log(this.state);
 
    let mapFifty =  fifty.map((item, idx) =>
    <option value={item.value} key={idx}>{item.state}</option>
    );

    let mapActivities =  activities.map((item, idx) =>
    <option value={item.value} key={idx}>{item.activity}</option>
    );

    return (
      <>
        <h2>PARKPAL</h2>

        <h3>Choose a park to learn more!</h3>

        <Form onSubmit={this.getParkData}>
         <Form.Control as='select' onChange={this.handleState}>
          <option>Choose a state to learn more</option>
          {mapFifty}
         </Form.Control>
         <Form.Control as='select' onChange={this.handleActivity}>
          <option>Choose an activity to learn more</option>
          {mapActivities}
         </Form.Control>
         <Button id="homeButton" variant="primary" type="submit">Submit!</Button>
        </Form>

        

                      
      <div>
        <ParksList 
          parksArray={this.state.parks}
          currentPark={this.state.currentPark} 
          favsHandleSubmit={this.favsHandleSubmit} 
        />
         <Favorites 
            favsArray={this.state.favsParks} 
            handleDelete={this.handleDelete}
            // handleUpdateSubmit={this.handleUpdateSubmit}
         />

      </div>


      </>
    )
  }
}

export default Parks;
