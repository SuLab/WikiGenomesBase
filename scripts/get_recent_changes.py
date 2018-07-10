from tracker import get_revisions_past_weeks

qids = ["Q21169165", "Q21169446"]

revisions = get_revisions_past_weeks(qids, 3)

print (revisions)