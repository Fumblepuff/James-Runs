
import stripe from '@stripe/stripe-react-native';

import {
  cls,
} from 'src/styles';

class StripeUtils {
  static async payment(stripeApiKeyPublishable, clientSecret) {
    const res = {
      error: '',
      data: {},
    };
    let paymentMethodId;

    stripe.setOptions({
      publishableKey: stripeApiKeyPublishable,
    });

    try {
      const resStripe = await stripe.paymentRequestWithCardForm({
        theme: {
          primaryBackgroundColor: cls.white,
          secondaryBackgroundColor: cls.white,
          primaryForegroundColor: cls.black,
          secondaryForegroundColor: cls.black,
          accentColor: cls.blue,
          errorColor: cls.red,
        },
      });

      paymentMethodId = resStripe.id;
    } catch (e) {
      res.error = e.message;
      return res;
    }

    if (!paymentMethodId) {
      res.error = 'no token';
      return res;
    }

    try {
      const resApi = await stripe.confirmPaymentIntent({
        clientSecret,
        paymentMethodId,
      });

      if (resApi.status === 'succeeded') {
        res.data = resApi;
      } else {
        res.error = 'error';
      }
    } catch (e) {
      res.error = e.message;
    }

    return res;
  }
}

export default StripeUtils;
