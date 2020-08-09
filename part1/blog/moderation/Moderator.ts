enum ModerationStatus {
    Pending = 'pending',
    Rejected = 'rejected',
    Approved = 'approved'
}

class Moderator {

    private filteredWords = ['orange'];

    constructor(filter: string[]) {
        if (filter.isArray() && filter.length) {
            this.filteredWords = filter;
        }
    }

    private filterVocabulary = function(unfilteredText: string): Boolean {

        return this.filteredWords.some( (e) =>
         unfilteredText.includes(e)
        );
    }
   
    moderate = function(comment: string) : ModerationStatus {
        if (this.filterVocabulary(comment)) {
            return ModerationStatus.Rejected;
        } else {
            return ModerationStatus.Approved;
        }
    }
}