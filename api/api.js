let API = {
    id: 'asdf',
    base: 'https://rest.bandsintown.com/artists/'
};

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

$(document).ready(function () {
    $('#artist-search-form').on('submit', (e) => {
        e.preventDefault();
        $("#loader").fadeIn(1750);//loader FadeIn
        let $this = $(this);
        let term = $this.find('input[name=artist]').val();
        let $artistProfile = $('#artist-profile');
        let $eventCount = $('#upcoming-events-count');
        let $events = $('#events');

        if (!term) {
            return;
        }

        // prep
        $artistProfile.empty();
        $events.empty();
        $eventCount.empty();

        fetch(`${API.base}${term}?app_id=${API.id}`)
            .then(res => res.json())
            .then(res => {
                let $artist = `
                    <div class="listingResults">
                        <img class="personImage" src="${res.thumb_url}">
                        <div class="personDetails">
                            <p class="name">${res.name}</p>
                            <p class="listingSocialLink"><a href="${res.facebook_page_url}" title="${res.name}'s Facebook page" target="_blank">${res.facebook_page_url}</a></p>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                `;

                $artistProfile.append($artist);

                if (res.upcoming_event_count != 0) {
                    $eventCount.text(`${res.upcoming_event_count} upcoming events`);

                    fetch(`${API.base}${term}/events?app_id=${API.id}`)
                        .then(res => res.json())
                        .then(res => {
                            let events = '';
                            res.forEach(event => {
                                let eventDate = new Date(event.datetime);

                                let $event = `
                                    <div class="col-md-4">
                                        <div class="eventListing-eve">
                                            <p class="eventDetails">${event.description}</p>
                                        <hr>
                                        <div class="row">
                                            <div class="col">
                                                <p class="country">Country</p>
                                                <p class="country-name">${event.venue.country}</p>
                                                <p class="venue">Venue</p>
                                                <p class="venue-loc">${event.venue.name}</p>
                                            </div>
                                            <div class="col">
                                                <p class="city">City</p>
                                                <p class="city-name">${event.venue.city}</p>
                                                <p class="date">Date</p>
                                                <p class="date-e">${eventDate.getDate()} ${monthNames[eventDate.getMonth()]}, ${eventDate.getFullYear()}</p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                `;

                                events += $event;
                            });

                            $events.append(events);
                        });
                } else {
                    $eventCount.text(`There are no upcoming events by ${res.name}`);
                }
                $("#loader").css("display","none");//loader 
            });

    });
});