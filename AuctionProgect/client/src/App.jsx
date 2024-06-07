import React, { createContext, useEffect, useRef, useState } from 'react'
import './App.css'

import axios from "axios"
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import localSitePath from '../localSitePath'
import Footer from './components/particals/footer/footer'
import Popup from './components/particals/popup/popup'
import AuctionParticipantsPage from './pages/AuctionParticipants/participants'
import ChangeProductInfo from './pages/ChangeProductInfo/ChangeProd'
import MainPage from './pages/MainPage/mainpage'
import Notfound from './pages/NotFound/notfound'
import DetailedProduct from './pages/ProductsList/DetailedProd/detailedProd'
import ProductsList from './pages/ProductsList/productsList'
import UserProfile from './pages/UserProfile/userProfile'
import VisitUserProfile from './pages/VisitUserProfile/visitUserProfile'
import UserEntry from './pages/userentry/userentry'
import { RandInt } from './utils/FnsUtilts'


// let darkThemeContext = createContext(false)
let userDataContext = createContext(null)

let ProdStatusContext = createContext(null)
// main - добавление в корзину
// basket - удаление из корзины
// myprods - удаление из моих продуктов


let PopupContext = createContext(null)



function App() {
  // addProducts()

  const [userData, setUserData] = useState('');
  const [messages, setMessages] = useState([]);

  const timersRef = useRef({});

  useEffect(() => {
    axios.post(
      `${localSitePath}/auth/getUserData`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(response => response.data)
      .then(data => setUserData(data))
      .catch(error => console.log('Ошибка:' + error));
  }, []);


  const showMessage = ({ message, bad }) => {
    const newMessage = { id: `${Date.now()} ${RandInt(0, 100)}`, message, bad };

    setMessages([newMessage, ...messages]);

    const timerId = setTimeout(() => {
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== newMessage.id));
    }, 3000);

    timersRef.current[newMessage.id] = timerId;
  };



  return (
    <>

      {/* <button onClick={() => showMessage({ message: "loch22", bad: true })}></button> */}
      <Popup messages={messages} />

      <userDataContext.Provider value={{ userData }}>
        <PopupContext.Provider value={{ showMessage }}>
          <ProdStatusContext.Provider value={"main"} >
            <Router>
              <Routes>
                <Route exact path='/' element={<MainPage />} />
                <Route exact path='/userentry' element={<UserEntry />} />
                <Route exact path='/profile/*' element={<UserProfile />} />
                <Route exact path='/visit/:username' element={<VisitUserProfile />} />
                <Route exact path='/participants/:productId' element={<AuctionParticipantsPage />} />

                <Route exact path='/products/*' element={

                  <Routes>
                    <Route index element={
                      <>
                        <ProductsList />
                      </>
                    } />

                    <Route path='/:category'
                      element={<ProductsList />}
                    />
                    <Route path='/detailed/:productId'
                      element={<DetailedProduct />}
                    />
                    <Route path='/change/:productId'
                      element={<ChangeProductInfo />}
                    />
                    <Route path="*" element={<h1>Товары не найдены</h1>} />
                  </Routes>
                } />

                <Route path="*" element={<Notfound />} />
              </Routes>

              <Footer />
            </Router>
          </ProdStatusContext.Provider>
        </PopupContext.Provider>
      </userDataContext.Provider >
    </>
  )
}

export {
  App, PopupContext, ProdStatusContext, userDataContext
}
