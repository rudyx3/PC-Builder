import React, { useEffect, useRef, useState } from "react";
import SideBar from "../components/SideBar";
import ProductCard from "../components/productCard";
import { Stack } from "@mui/system";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const GPU = () => {
  const [gpuList, setGpuList] = useState([]);
  const itemsPerPage = 3; // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1);
  
  const d1 = {
    label: "Company",
    dropOpt: {
      0: "AMD",
      1: "Nvidia",
    },
  };
  const d2 = {
    label: "Family",
    dropOpt: {
      0: "GeForce RTX 3000",
      1: "GeForce RTX 4000",
      2: "GeForce RTX 2000",
      3: "GeForce GTX",
      4: "Radeon RX",
      5: "GeForce GT",
    },
  };

  const drop_1 = {
    0: d1,
    1: d2,
  };
  const VRAM = {
    title: "VRAM",
    min: 4,
    max: 12,
    step: 2,
    marks: [
      { value: 2, label: "2" },
      { value: 4, label: "" },
      { value: 6, label: " " },
      { value: 8, label: " " },
      { value: 10, label: " " },
      { value: 12, label: "12" },
    ],
  };

  const price = {
    title: "Price",
    marks: [
      { value: 500, label: "500" },
      { value: 10000, label: "10K" },
    ],
    min: 50,
    max: 500,
    step: 5,
  };

  const slider_Num = 2;
  const main_slider = {
    0: VRAM,
    1: price,
  };

  const checkbox = {
    0: {
      title: "Manufacturer",
      options: {
        0: "Asus",
        1: "AsRock",
        2: "Acer",
        3: "GigaByte",
        4: "MSi",
        5: "Zotac",
        // Add more options as needed
      },
    },
    1: {
      title: "Memory Type",
      options: {
        0: "GDDR4",
        1: "GDDR5",
        2: "GDDR5X",
        3: "GDDR6",
        4: "GDDR6X",
        // Add more options as needed
      },
    },
    // Add more categories as needed
  };
  const containerStyle = {
    display: "flex",
    flexDirection: "row",
  };
  const productCardStyle = {
    flex: "2",
    marginLeft: "6vh",
  };
  const stackStyle = {
    marginTop: "1vh",
  };
  const theme = createTheme({
    typography: {
      fontFamily: "poppins, montserrat, sans-serif",
    },
    backgroundColor: "#373538",
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
  const totalProductCards = 3;
  // Calculate the number of stacks based on the number of product cards
  const calculateStacks = () => {
    let productCardsPerStack = calculateProductCardsPerStack();
    // Total number of product cards
    let totalStacks = Math.ceil(totalProductCards / productCardsPerStack);
    if (totalStacks * productCardsPerStack < totalProductCards) {
      totalStacks += 1;
    }
    return totalStacks;
  };

  const calculateRange = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return gpuList.slice(startIndex, endIndex);
  };
  

  // Initialize state to hold the number of product cards per stack and the number of stacks
  const [productCardsPerStack, setProductCardsPerStack] = useState(
    calculateProductCardsPerStack()
  );
  const [totalStacks, setTotalStacks] = useState(calculateStacks());

  // Update the number of product cards per stack and the number of stacks when the screen is resized
  const handleResize = () => {
    setProductCardsPerStack(calculateProductCardsPerStack());
    setTotalStacks(calculateStacks());
  };
  useEffect(() => {
    // Listen for window resize events and update the layout
    window.addEventListener("resize", handleResize);

    loadData();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  async function loadData() {
    try {
      const res = await fetch("http://localhost:3000/api/GPU");
      const data = await res.json();
      setGpuList(data);
    } catch (error) {
      console.log(error);
    }
  }
  
  
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
        <SideBar
          drop={drop_1}
          slider={main_slider}
          sliderNum={slider_Num}
          checkboxCategories={checkbox}
        ></SideBar>
        <div style={productCardStyle}>
          {[...Array(totalStacks)].map((_, stackIndex) => {
            // Determine how many product cards should be in this stack
            const curr_stack = stackIndex + 1;
            let num = curr_stack * productCardsPerStack;
            const cardsInThisStack =
              stackIndex === totalStacks - 1 && num > totalProductCards
                ? 1
                : productCardsPerStack;

            // Render a stack with the appropriate number of product cards
            return (
              <Stack
                key={stackIndex}
                direction="row"
                spacing={"0.5vw"}
                style={stackStyle}
              >
             {calculateRange().map((gpu, index) => (
  <ProductCard
    key={gpu.id}
    style={{
      marginTop: index > 0 ? "1vh" : "0",
      marginLeft: index % 3 > 0 ? "1vw" : "0",
    }}
    price={gpu.price}
    id={gpu.id}
    image={gpu.image}
    name={gpu.name}
    feat1={gpu.part_type}
    feat2={`power: ${gpu.power}`}
    feat4={`resolution:${gpu.resolution}`}
    feat3={`vram:${gpu.vram}`}
    brand={gpu.brand}
  />
))}

<div style={{ display: "flex", justifyContent: "center", marginTop: "1vh" }}>
  <button
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <button
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={
      currentPage === Math.ceil(gpuList.length / itemsPerPage)
    }
  >
    Next
  </button>
</div>
</Stack>
            );
          })}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default GPU;
