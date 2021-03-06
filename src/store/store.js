/**
 * Created by VisionVr on 10/27/2017.
 */
// importing VUE X
import Vue from 'vue';
import Vuex from 'vuex';
// importing Routers
import { routes } from '../routes'
// importing Firebase
import * as firebase from 'firebase'
// importing Vue Resource
import VueResource from 'vue-resource'

Vue.use(Vuex);

// Storage
export const store = new Vuex.Store({
  state: {
    // Application Information
    app:{
      name: 'BAMS™ Node',
      fullname: 'Brand Ambassador Control System',
      author : 'radean',
      authorEmail : 'radeanf@gmail.com',
      developer : 'radean',
      company : 'Vision Direct Marketing',
      brandName: 'Emborg™ Pakistan',
      brandSlogan: "Since 1947 ",
      version : 'v.0.1',
      theme: 'grey darken-3',
      connection: true,
      header:{
        name: 'BAMS™',
        location: 'Pakistan'
      },
      mode: '',
      status : true,
      isConnected: false,
      broadcast: true,
      subscription: true
    },
    // Main Headers
    dataHeader: {
      date: 'Date',
      merchandiserName: 'Merchandiser Name',
      storeName: 'Store Name',
      address: 'Address',
      shopKeeperName: 'Name',
      contact: 'Contact Number',
      // Poster
      posm: {
        mobile: 'Mobile',
        poster: 'Poster',
        banner: 'Banner'
      },
      // Other Brand Available
      otherBrands: {

      },
      // Competetors
      competetor:{
        naurus: 'Naurus',
        roohAfza: 'Rooh Afza',
        others: 'Other Brands'
      },
      //others
      other: {

      }
    },
    // Data Fields
    // Also Change this in Store Detail Enum Page4
    basicInfoFields: [
      {id: 0, tabIndex: 1, title: 'Store Name' , variable: 'storeName', size: 'xs6', type: 'text'},
      {id: 1, tabIndex: 2,title: 'Keeper Name', variable: 'keeperName', type: 'text'},
      {id: 2, tabIndex: 3,title: 'Contact Number', variable: 'contactNumber', type: 'number'},
    ],
    stockFields: [
      {id: 3, tabIndex: 4,title: 'Mobile', variable: 'mobile', type: 'number'},
      {id: 4, tabIndex: 5,title: 'Poster', variable: 'poster', type: 'number'},
      {id: 5, tabIndex: 6,title: 'Banner', variable: 'banner', type: 'number'},
    ],
    otherFields: [
      {id: 6, tabIndex: 7,title: 'Naurus', variable: 'naurus', type: 'number'},
      {id: 7, tabIndex: 8,title: 'Rooh Afza', variable: 'roohAfza', type: 'number'},
      {id: 7, tabIndex: 9,title: 'Quice', variable: 'quice', type: 'number'},
      {id: 8, tabIndex: 10,title: 'Other Brands', variable: 'otherBrands', type: 'number'}
    ],
    // Notification
    notification:{
      title: null,
      body: null
    },
    // App Loading Stats
    successFlag: false,
    successMsg: 'Operation Successful',
    userError: false,
    snickError: {
      state: false,
      msg: 'Operation Failed',
    },
    loadingState:{
      mainLoading: false,
      compressorLoadingStats: false,
    },
    // setting Store ID
    sel_storeid: '30502',
    // storelists:
    stores: [],
    storeDetails: [],
    //User Session
    // Current user Details
    userinfo: {},
    baList: {},
    user: null,
    // OFFLINE SUPPORT ADDED
    // ====================
    offlineStoreReport: [],


  },
  mutations: {
    setConnectionStat (state, payload) {
      state.app.connection = payload;
    },
    setTheme(state, payload){
      state.app.theme = payload;
    },
    setAppHeader(state, payload){
      state.app.header.name = payload.name;
      state.app.header.location = payload.location;
    },
    setNotification(state, payload){
      state.notification.title = payload.title;
      state.notification.body = payload.body;
    },
    setMode(state, payload){
      state.app.mode = payload;
    },
    setUser (state, payload){
      state.user = payload;
    },
    setBaList (state, payload){
      state.baList = payload;
    },
    setUserInfo (state, payload){
      state.userinfo = payload;
    },
    setSnickError(state, payload){
      state.snickError.active = payload.state;
      state.snickError.msg = payload.msg;
    },
    'SET_STORES'(state, payload){
      state.stores = payload;
    },
    'SET_STORE_DETAILS'(state, payload){
      state.storeDetails = payload;
    },
    'SET_SEL_STORE_ID'(state, payload){
      state.sel_storeid = payload;
    },
    'SET_MAIN_LOADING'(state, payload) {
      state.loadingState.mainLoading = payload;
    },
    'SET_USER_ERROR'(state, payload){
      state.userError = payload;
    },
    'SET_SUCCESS_MSG'(state, payload){
      state.successFlag = !state.successFlag;
      state.successMsg = payload;
    }
  },
  actions: {

    // USER AUTHENTICATION
    userSignUp({commit}, payload){

      // Converting Varialble

      let userID;
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then((user) => {
        commit('SET_MAIN_LOADING', true);
        const userInfo = {
          uniqueId: user.uid,
          name: payload.user.name,
          password: payload.password,
          email: payload.email,
          assignStore: payload.user.assignStore,
          address: payload.user.address,
          role: payload.user.role
        };
          return firebase.database().ref('users').push(userInfo).then(() => {
          commit('SET_MAIN_LOADING', false);
        }).catch((error) => {
          console.log(error)
        })
        }).catch(
        error => {
          commit('SET_USER_ERROR', true);
          setTimeout(() => {
            commit('SET_USER_ERROR', false);
          }, 4000)
        }
      );
    },
    userSignIn({commit}, payload){
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(firebase.auth().onAuthStateChanged(appUser => {
            commit('setUser', appUser)
        })).catch(
          error => {
            commit('SET_USER_ERROR', true);
            console.log(error);
            setTimeout(() => {
              commit('SET_USER_ERROR', false);
            }, 4000)
          })
      },
    // User Session Check
    userSession({dispatch, commit}){
      // Checking Firebase user
      // dispatch('appStatus');
      firebase.auth().onAuthStateChanged(appUser => {
        if(appUser) {
          // setting Authorization
          commit('setUser', appUser);
          dispatch('subUserInfo');
          // dispatch('appMode');
        }else{
          commit('setUser', null);
        }
      });
    },
    // user information update
    subUserInfo({commit, getters}){
      // Setting Loading
      commit('SET_MAIN_LOADING', true);
      // setting user information
      firebase.database().ref('supervisors').orderByChild('uniqueId').equalTo(getters.user.uid).once('value', (user) => {
        let userinfo = {};
        const obj = user.val();
        for (let key in obj) {
          userinfo = {
            uid: obj[key].uniqueId,
            name: obj[key].name,
            email: obj[key].email,
            stores : obj[key].stores,
            address: obj[key].address,
            shift: obj[key].shift,
            dateAssigned: obj[key].dateAssigned,
            dateofBirth: obj[key].dateofBirth
            // role: obj[key].role
          };
        }
        commit('setUserInfo', userinfo);
        if(getters.userInfo.role === "Supervisor"){
          // if user is supervisor then set mode to "SuperVisor"
          commit('setMode', 'Supervisor');
          // and color to Blue
          commit('setTheme', 'blue accent-4');
        }else if(getters.userInfo.role === "BrandAmbassador"){
          // if user is B.A then set mode to "B.A"
          commit('setMode', 'BrandAmbassador');
          // and color to Red
          commit('setTheme', 'red accent-4');
        }
        commit('SET_MAIN_LOADING', false);
      });
    },
    // user Log out
    userSignOut({commit}){
      commit('SET_MAIN_LOADING', true);
      firebase.auth().signOut().then(() =>{
        // Setting ApplicationDetails
        let storeData = {
          name: 'MCS™',
          location: ''
        };
        // setting App Header
        commit('setAppHeader', storeData);
        commit('setUserInfo', null);
        commit('setUser', null);
        commit('SET_MAIN_LOADING', false);
      });
    },

  // ====================================
  //   GUI APP
    appHeader({commit}, payload){
      let header = {
        name: payload,
        location: ''
      };
      commit('setAppHeader', header);
    },


  // ==================================
    //Checking Connection

    connectionRef({commit}){
      let connection = firebase.database().ref('/.info/connected');

      connection.on('value', (snap) => {
        if(snap.val() == true){
          commit('setConnectionStat', true)
        } else {
          commit('setConnectionStat', false)
        }
      });
    },

    // Go Offline
    onNotification({commit}, payload){
      let Ntitle = payload.notification.title;
      let Nbody = payload.notification.body;
      let parse = {body: Nbody, title: Ntitle, status: true};
      commit('setNotification', parse);
    },
    // Go Online
    goOnline (){
      firebase.database().goOnline();
    },
    // Pushing DataBase

    pushToFirebase(payload){
      firebase.database().ref('storedata/' + payload.date + '/').push({ payload })
    },

    // setting Store ID
    setStoreId({dispatch ,commit}, payload){
      // Getting Assigned BA
      // dispatch('baListUPD');
      let sel_store_id = payload.storeid;
      let storeData = {
        name: payload.storeName,
        location: payload.storeLocation
      }
      // setting App Header
      commit('setAppHeader', storeData);
      commit('SET_SEL_STORE_ID', sel_store_id)
    },


    // Uploading Data
    pushStoreData({commit, getters}, payload){
      commit('SET_MAIN_LOADING', true);
      const stockdata = {
        storename: payload.storename,
        storeid: payload.storeid,
        soyaSupremeStock: payload.soyaSupremeStock,
        date: payload.date,
        // visits: payload.visits,
        baName: payload.baName,
        interceptions: payload.interceptions,
        creatorId: getters.userInfo.uid,
        userName: getters.userInfo.name,
        // image
        storePicImg: payload.storePicImg,
        beforePictureImg: payload.beforePictureImg,
        afterPictureImg: payload.afterPictureImg,
      };
      let storePicImgUrl;
      let beforePictureImgUrl;
      let afterPictureImgUrl;
      let key;
      let date = stockdata.date;

      firebase.database().ref('stockdata').push(stockdata)
      .then((data) => {
        key = data.key;
        return key
      }).then(() => {
        // putting Date
        return firebase.database().ref('stores/' + payload.storeid + '/visits/').update(payload.visits);
      }).then(() => {


        // Image 1
        const filenameA = payload.storePicImg.name;
        const ext = filenameA.slice(filenameA.lastIndexOf('.'));
        return firebase.storage().ref('storeimages/' + date + '/' + key + 'storePic' + ext).put(payload.storePicImg)
      }).then(fileData => {
        storePicImgUrl = fileData.metadata.downloadURLs[0];
        return firebase.database().ref('stockdata').child(key).update({storePicImgUrl: storePicImgUrl})
      }).then(() => {


        // Image 2
        const filenameB = payload.beforePictureImg.name;
        const ext = filenameB.slice(filenameB.lastIndexOf('.'));
        return firebase.storage().ref('storeimages/' + date + '/' + key + 'beforePicture'  + ext).put(payload.beforePictureImg)
      }).then(fileData => {
        beforePictureImgUrl = fileData.metadata.downloadURLs[0];
        return firebase.database().ref('stockdata').child(key).update({beforePictureImgUrl: beforePictureImgUrl})
      }).then(() => {


        // Image 3
        const filenameC = payload.afterPictureImg.name;
        const ext = filenameC.slice(filenameC.lastIndexOf('.'));
        return firebase.storage().ref('storeimages/' + date + '/' + key + 'afterPicture'  + ext).put(payload.afterPictureImg)
      }).then(fileData => {
        afterPictureImgUrl = fileData.metadata.downloadURLs[0];
        return firebase.database().ref('stockdata').child(key).update({afterPictureImgUrl: afterPictureImgUrl})
      }).then(() => {
        commit('SET_MAIN_LOADING', false);
      })
        .catch((error) => {
          console.log(error)
        })
    },



    // Uploading Data
    pushStoreReport({commit, getters}, payload){
      commit('SET_MAIN_LOADING', true);
      // let purchase = payload.purchased;
      // let sorted = [];
      // for (let key in purchase){
      //   if(purchase[key] === 'NaN'){
      //   }
      //   sorted.push(purchase[key])
      // }
      const report = {
        purchased: payload.purchased,
        customerName: payload.customerName,
        customerContact: payload.customerContact,
        creatorId: getters.userInfo.uid,
        userName: getters.userInfo.name,
        store : {
          id: payload.storeid,
          name: payload.storename,
          address: payload.storeAddress
        }
      };


      firebase.database().ref('storedata/' + payload.date + '/').push(report)
        .then(() => {
        commit('SET_MAIN_LOADING', false);
          // Sending Success Message
          commit('SET_SUCCESS_MSG', 'Submission Complete');
          setTimeout(() => {
            commit('SET_SUCCESS_MSG', 'Operation Successful');
          }, 4000);
      })
        .catch((error) => {
          commit('SET_MAIN_LOADING', false);
          let errorStatus = {
            state: true,
            msg: 'Connection Error!'
          }
          // Sending Error Message
          commit('setSnickError', errorStatus);
          setTimeout(() => {
            errorStatus.state = false
            commit('setSnickError', errorStatus);
          }, 4000);
          console.log(error)
        })
      commit('SET_MAIN_LOADING', false);
    },

    // Key Message from Employees
    pushMessages({commit, getters}, payload){
      commit('SET_MAIN_LOADING', true);
      const msg = {
        msg: payload,
        creatorId: getters.userInfo.uid,
        userName: getters.userInfo.name,
      };
      // commit('SET_MAIN_LOADING', false);

      firebase.database().ref('msg/').push(msg)
        .then(() => {
          commit('SET_MAIN_LOADING', false);
          // Sending Success Message
          commit('SET_SUCCESS_MSG', 'Message Sent Successfuly');
          setTimeout(() => {
            commit('SET_SUCCESS_MSG', 'Operation Successful');
          }, 4000);
        })
        .catch((error) => {
          console.log(error)
        })
    },


    // Fetching Data
    // Store Lists
    // B.A List
    baListUPD({commit}){
      // Fetching FB
      firebase.database().ref('users').orderByChild('role').equalTo("BrandAmbassador").once('value', (ba) => {
        let baList = {};
        const obj = ba.val();
        for (let key in obj) {
          let baname= obj[key].name;
          baList[baname] = {
            uid: obj[key].uniqueId,
            name: obj[key].name,
            email: obj[key].email,
            address: obj[key].address,
            role: obj[key].role
          };
        }
        // setting Mutations
        commit('setBaList', baList)
      })
    },
    // Store List
    storeListUPD({commit}, payload){
      let today = payload;
      commit('SET_MAIN_LOADING', true);
      firebase.database().ref('stores')
        .orderByChild('visits/' + today)
        .equalTo(null)
        .on('value', (storelist) => {
        const stores = [];
        const obj = storelist.val();
        for (let key in obj) {
          stores.push({
            id: key,
            name: obj[key].name,
            address: obj[key].address,
            visits: obj[key].visits,
          });
        }
        commit('SET_MAIN_LOADING', false);
        commit('SET_STORES', stores);
      });
    },
    // Store Detail
    fetchStoreDetails({commit, getters}){
      firebase.database().ref('stores').orderByKey().equalTo(getters.selStoreId.toString()).once('value', (storedetails) => {
        const storeDetail = [];
        const obj = storedetails.val();
        for (let key in obj) {
          storeDetail.push({
            id: key,
            name: obj[key].name,
            address: obj[key].address
          })
        }
        commit('SET_STORE_DETAILS', storeDetail)
      });
    }
  },
  getters: {
    appinfo (state){
      return state.app
    },
    // Data fields getters
    basicInfoFields (state){
      return state.basicInfoFields
    },
    stockFields (state){
      return state.stockFields
    },
    otherFields (state){
      return state.otherFields
    },
    notification (state){
      return state.notification
    },
    offlineDB (state){
      return state.app.isConnected
    },
    connectionStat (state){
      return state.app.connection
    },
    user (state){
      return state.user
    },
    userInfo (state) {
      return state.userinfo
    },
    baList (state) {
      return state.baList
    },
    stores (state) {
      return state.stores
    },
    storeDetail (state) {
      return state.storeDetails
    },
    selStoreId (state){
      return state.sel_storeid
    },
    loadingState (state){
      return state.loadingState
    },
    userError (state){
      return state.userError
    },
    snickError (state){
      return state.snickError
    },
    successMsg (state){
      return state.successMsg
    },
    successFlag (state){
      return state.successFlag
    }
  }
});





