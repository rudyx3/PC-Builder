import React, { useEffect, useRef, useState } from 'react';
import SideBar from '../components/SideBar';
import ProductCard from '../components/productCard';
import { Stack } from '@mui/system';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const Storage = () => {
  const d1 = {
    label: 'Manufacturer',
    dropOpt: {
      0: 'Corsar',
      1: 'GSkill',
      2: 'Samsung',
      3:"Trident",
    },
  };
    const d2={
          label:'Type',
          dropOpt:{
                0:'SSD',
                1: 'HHD',
                2:'Hybrid',
                }
        }
      
    const drop_1={
      0:d1,
      1:d2,
    }
    const Capacity={
        title:'Capacity',
        min:256,
        max:2048,
        step:256,
        marks:[
          {value:256,label:'256 GB'},
          {value:512,label:'512 GB'},
          {value:1024,label:'1 TB'},
          {value:2048,label:'2 TB'},
      ]
       
    }
  
    
      const price={
        title:'Price',
        marks:[
          {value:500,label:'500'},

          {value:10000,label:'10K'},
        ],
        min:500,
        max:10000,
        step:500,
      }
    

    const slider_Num=2;
    const main_slider={
        0:price,
        1:Capacity,
      
    }
    const checkbox = {
      0: {
        title: 'NvME',
        options: {
          0: 'Yes',
          1: 'No',
          // Add more options as needed
        },
      },
      1: {
        title: 'Form Factor',
        options: {
          0: '3.5"',
          1: '2.5"',
          // Add more options as needed
        },
      },
      // Add more categories as needed
    };
    const containerStyle = {
      display: 'flex',
      flexDirection: 'row',
    };
    const productCardStyle = {
      flex: '2',
      marginLeft: '6vh',
    };
    const stackStyle = {
      marginTop: '1vh',
    };
    const theme = createTheme({
      typography: {
        fontFamily: 'poppins, montserrat, sans-serif',
      },
      backgroundColor:'#373538',
    });
    const maxProductCardsPerStack = 3;

    // Calculate the number of product cards per stack based on screen width
    const calculateProductCardsPerStack = () => {
      const screenWidth = window.innerWidth;
  
      let productCardsPerStack = maxProductCardsPerStack;
  
      if (screenWidth < 1000) {
        productCardsPerStack = 1; // Adjust this based on your desired breakpoint
      } else if (screenWidth < 1400) {
        productCardsPerStack = 2; // Adjust this based on your desired breakpoint
      }
  
      return productCardsPerStack;
    };
    const totalProductCards = 9;
    // Calculate the number of stacks based on the number of product cards
    const calculateStacks = () => {
      let productCardsPerStack = calculateProductCardsPerStack();
       // Total number of product cards
      let totalStacks = Math.ceil(totalProductCards / productCardsPerStack);
      if((totalStacks*productCardsPerStack)<totalProductCards){
        totalStacks+=1;
      }
      return totalStacks;
    };
  
    // Initialize state to hold the number of product cards per stack and the number of stacks
    const [productCardsPerStack, setProductCardsPerStack] = useState(calculateProductCardsPerStack());
    const [totalStacks, setTotalStacks] = useState(calculateStacks());
  
    // Update the number of product cards per stack and the number of stacks when the screen is resized
    const handleResize = () => {
      setProductCardsPerStack(calculateProductCardsPerStack());
      setTotalStacks(calculateStacks());
    };
    useEffect(() => {
      // Listen for window resize events and update the layout
      window.addEventListener('resize', handleResize);
  
      // Clean up the event listener when the component unmounts
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  return (
    <ThemeProvider theme={theme}>
    <style>
        {`
          body {
            background-color: #373538; /* Set your desired background color here */
          }
        `}
      </style>
      <div style={containerStyle}>
      <SideBar drop={drop_1} slider={main_slider} sliderNum={slider_Num} checkboxCategories={checkbox}></SideBar>
      <div style={productCardStyle}>
          {[...Array(totalStacks)].map((_, stackIndex) => {
            // Determine how many product cards should be in this stack
            const curr_stack=stackIndex+1;
            let num=curr_stack*productCardsPerStack
            const cardsInThisStack = stackIndex === totalStacks - 1 && num > totalProductCards ? 1 : productCardsPerStack;

            // Render a stack with the appropriate number of product crds
            return (
              <Stack key={stackIndex} direction="row" spacing={'0.5vw'} style={stackStyle}>
                {[...Array(cardsInThisStack)].map((_, cardIndex) => (
                  // Render a product card with spacing
                  <ProductCard key={cardIndex} style={{ marginTop: cardIndex > 0 ? '1vh' : '0' }} />
                ))}
              </Stack>
            );
          })}
        </div>
      </div>
    </ThemeProvider>
  )
}


export default Storage