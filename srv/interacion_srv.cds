using app.interactions from '../db/interactions';
using {sap} from '@sap/cds-common-content';

service CatalogService {

    @requires           : 'authenticated-user'
    @cds.redirection.target
    @odata.draft.enabled: true
    entity Interactions_Header as projection on interactions.Headers;

    @requires: 'Admin'
    entity Interactions_Items  as projection on interactions.Items;

    @readonly
    entity Languages           as projection on sap.common.Languages;

    @readonly
    @restrict: [{
        grant: 'READ',
        where: 'country_code = ''DE'''
    }]
    entity HeaderView          as projection on interactions.Headers;

}
