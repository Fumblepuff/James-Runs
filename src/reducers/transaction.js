
import Api from '../utils/ApiUtils';

const INITIAL_STATE = {
  payment:false,
  runItem:'',
  cost:5,
  purchases:[],
};

/* --------------- ACTION TYPES --------------- */

const SET_PAYMENT = 'SET_PAYMENT';
const SET_RUN_ITEM = 'SET_RUN_ITEM';
const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS';
const SET_COST = 'SET_COST';

/* -------------- ACTION CREATORS -------------- */

export const loadTransaction = transaction => ({ type: LOAD_TRANSACTIONS, payload: transaction });
export const setRunItem = runItem => ({ type: SET_RUN_ITEM, payload: runItem });
export const setPayment = payment => ({ type: SET_PAYMENT, payload: payment });
export const setCost = cost => ({ type: SET_COST, payload: cost });

/* -------------- ASYNC ACTION CREATORS -------------- */

export const squareTransaction = (type, data) => (dispatch) => {

    return new Promise((resolve, reject) => {
        try {
        Api.post('square.php',
            {'type':type, 'data':data })
            .then((res) => {

                resolve(res.data);

            })
            .catch(error => console.error(error));
        }
        catch (e) {
            reject(e);
        }


    });

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOAD_TRANSACTIONS:
            return { ...state,  purchases: [...state.transaction, action.payload]  };

        case SET_PAYMENT:
            return { ...state, payment: action.payload };

        case SET_RUN_ITEM:
            return { ...state, runItem: action.payload };

        case SET_COST:
            return { ...state, cost: action.payload };

        default:
            return state;
    }
};
