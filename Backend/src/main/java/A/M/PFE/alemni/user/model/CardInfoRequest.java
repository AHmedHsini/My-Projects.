package A.M.PFE.alemni.user.model;

import lombok.Data;

@Data
public class CardInfoRequest {
    private String cardNumber;
    private String expiryDate;
    private String cvv;
}
