namespace app.interactions;

using {
    Country,
    Currency,
    cuid,
    managed
} from '@sap/cds/common';

type BusinessKey : String(10);
type Price       : Decimal(10, 2);
type Text        : String(1024);

entity Headers : cuid, managed {
    items   : Composition of many Items
                  on items.interaction = $self;
    partner : BusinessKey;
    country : Country;
};

entity Items : cuid {
    interaction : Association to Headers;
    text        : localized Text;
    date        : DateTime;

    @Semantics.amount.currencyCode: 'currency'
    price       : Price;
    currency    : Currency;
};

entity Products : cuid, managed {
    name       : String(255);
    created_at : DateTime;
    price      : Decimal(10, 2);
    currency   : String(3);
    status: Integer default 1;
}
