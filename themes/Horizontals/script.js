//delay = 5000;
mmrwchange = false;
//occasionnal = 'Occasional';

// The elements to create while respecting the order
sort = [
	'Icon_MMR',		'RocketStats_MMR',
	'Separator',
	'Icon_Win',		'RocketStats_Win',
	'Separator',
	'Icon_Loose',	'RocketStats_Loose',
	'Separator',
	'Icon_Streak',	'RocketStats_Streak'
];

if ( getOption( 'align_on_right' ) )
{
	sort = [
		'RocketStats_MMR',		'Icon_MMR',
		'Separator',
		'RocketStats_Win',		'Icon_Win',
		'Separator',
		'RocketStats_Loose',	'Icon_Loose',
		'Separator',
		'RocketStats_Streak',	'Icon_Streak'
	];
}

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

	if ( getOption( 'align_on_right' ) )
		document.querySelector( '#container' ).classList.add( 'right' );
};
