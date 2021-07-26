//delay = 5000;
mmrwchange = false;
//occasionnal = 'Occasional';

// The elements to create while respecting the order
sort = [
	'RocketStats_MMR',
	'RocketStats_Win',
	'RocketStats_Loose',
	'RocketStats_Streak'
];

if ( getOption( 'icons_reverse' ) )
	sort = sort.concat( [ 'Separator', 'Icon_MMR', 'Icon_Win', 'Icon_Loose', 'Icon_Streak' ] );
else
	sort = [ 'Icon_MMR', 'Icon_Win', 'Icon_Loose', 'Icon_Streak', 'Separator' ].concat( sort );

if ( getOption( 'display_rank' ) )
	sort.unshift( 'RocketStats_Rank' );

// Adding static or loaded elements from text files to the overlay
files[ 'Separator' ] = {
	static: true,
	type: 'div'
};

// Function called by the overlay after the elements have been created
window[ 'themeInit' ] = () => {
	if ( getOption( 'background_on_icons' ) )
		document.querySelector( '#container' ).classList.add( 'icons' );

	if ( getOption( 'background_on_values' ) )
		document.querySelector( '#container' ).classList.add( 'values' );

	if ( getOption( 'fixed_size' ) )
		document.querySelector( '#container' ).classList.add( 'fixed' );

	if ( getOption( 'rank_reverse' ) )
		document.querySelector( '#container' ).classList.add( 'rank-reverse' );

	if ( getOption( 'rank_vertical' ) )
		document.querySelector( '#container' ).classList.add( 'rank-vertical' );

	if ( getOption( 'icons_reverse' ) )
		document.querySelector( '#container' ).classList.add( 'icons-reverse' );
};
