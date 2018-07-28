from wikidataintegrator import wdi_login, wdi_core
from wikidataintegrator.wdi_helpers import publication

ids = ['25349155', '28030602', '29868501', '26173998', '24192348']

login = wdi_login.WDLogin(user="djow2019", pwd="")
for id in ids:
    pub = publication.PublicationHelper(ext_id=id, id_type='pmid', source='europepmc')
    print(pub.get_or_create(login=login))