package A.M.PFE.alemni.cours;

import A.M.PFE.alemni.user.UserRepository;
import A.M.PFE.alemni.user.model.User;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;


@Service
public class PaymentService {

    @Autowired
    private UserRepository userRepository;

    public PaymentService() {
        Stripe.apiKey = "sk_test_51PFMYb029myY9DubbRVNvhO6TqcV2RXHtzPSH4BIcn4lFDmx2Ozh0sUgdEHznGtz0xvMglt5wO2o6xBAhyG1Bpwf00TivspU4A";
    }

    public String createPaymentIntent(String userId, double amount) throws Exception {
        User user = userRepository.findById(userId).orElseThrow(() -> new Exception("User not found"));
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount((long) (amount * 100)) // amount in cents
                .setCurrency("usd")
                .setReceiptEmail(user.getEmail())
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);
        return paymentIntent.getClientSecret();
    }
}
