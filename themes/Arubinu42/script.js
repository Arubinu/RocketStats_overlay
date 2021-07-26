//delay = 5000;
mmrwchange = false;
//occasionnal = 'Occasional';

// The elements to create while respecting the order
sort = [
	'RocketLeague',
	'RocketStats_Rank',	'RocketStats_MMR',
	'Icon_Win',			'RocketStats_Win',
	'Icon_Loose',		'RocketStats_Loose',
	'Icon_Streak',		'RocketStats_Streak'
];

// Adding static or loaded elements from text files to the overlay
files[ 'RocketLeague' ] = {
	static: true,
	type: 'img',
	attributes: {
		src: './themes/Arubinu42/images/rocket-league.png'
	}
};

// Function called by the overlay after the elements have been created
window[ 'themeInit' ] = () => {
	if ( getOption( 'display_rocketleague' ) )
		document.querySelector( '#container' ).classList.add( 'logo' );

	if ( getOption( 'mmr_with_floatingpoint' ) )
		document.querySelector( '#container' ).classList.add( 'floatingpoint' );
};

// Function called by the overlay after the elements have been created
window[ 'themeUpdate' ] = ( name, content ) => {
	if ( name == 'RocketStats_MMR' )
	{
		let value = false;
		let is_float = ( content.indexOf( '.' ) > 0 );
		if ( !options.mmr_with_floatingpoint && is_float )
			value = content.split( '.' )[ 0 ];
		else if ( options.mmr_with_floatingpoint && !is_float )
			value = `${content}.00`;

		if ( value !== false )
			document.querySelector( '[file-target="RocketStats_MMR"]' ).innerText = value;
	}
};
