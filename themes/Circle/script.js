mmrwchange = false;

// The elements to create while respecting the order
sort = [
	'RocketStats_MMR',
	'RocketStats_Streak',
	'RocketStats_Win',
	'RocketStats_Loss'
];

if ( getOption( 'display_rank' ) )
	sort.unshift( 'RocketStats_Rank' );

if ( getOption( 'background_video' ) )
	sort.unshift( 'Background' );

// Adding static or loaded elements from text files to the overlay
files[ 'Background' ] = {
	static: true,
	type: 'video',
	value: './themes/Circle/assets/background.webm'
};

// Function called by the overlay after the elements have been created
window[ 'themeInit' ] = () => {
	if ( getOption( 'background_video' ) )
		document.querySelector( '#container' ).classList.add( 'video' );
};

// Function called by the overlay after the elements have been created
window[ 'themeUpdate' ] = ( name, content ) => {
	if ( name == 'RocketStats_MMR' && content.indexOf( '.' ) > 0 )
		document.querySelector( '[file-target="RocketStats_MMR"]' ).innerText = content.split( '.' )[ 0 ];
};
