/* global document, window, µ, $, QUnit, Benchmark, test  */
module.exports = function( buildTest )
{
    QUnit.module( 'dom.js' );


    QUnit.test( 'µ.ready()', function( assert )
    {
        assert.ok( µ.ready, 'exists' );

        var domReady    = assert.async();

        var loaded = function()
        {
            assert.equal( µ( 'h1' ).length, 1, 'is run after dom loads' );

            domReady();
        };

        µ.ready( loaded );


        buildTest( 'No speed tests available.', 59 );
    });


    QUnit.test( '.append()', function( assert )
    {
        assert.ok( µ().append, 'exists' );

        var µNewDiv = µ( '<div.a--new--div>' );
        var µTarget = µ( '#example--id' );

        µTarget.append( µNewDiv );
        assert.deepEqual( µNewDiv[0], µTarget.children()[0][0], 'attached microbe' );
        µNewDiv.remove();

        µTarget.append( µNewDiv[0] );
        assert.deepEqual( µNewDiv[0], µTarget.children()[0][0], 'attached element' );
        µNewDiv.remove();

        // NON FUNCTIONAL TEST
        // this is a future ability and cannot be tested yet
        //
        // µTarget.append( '<div.a--new--div>' );
        // assert.deepEqual( µ( '.a--new--div' )[0], µTarget.children()[0], 'attached by creation string' );
        // µ( '.a--new--div' ).remove();

        var µAnotherNewDiv = µ( '<div.a--new--div>' );

        // NON FUNCTIONAL TEST
        // this is a future ability and cannot be tested yet
        //
        // µTarget.append( [ µNewDiv, µAnotherNewDiv ] );
        // assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 microbes' );
        // µNewDiv.remove();
        // µAnotherNewDiv.remove();

        µTarget.append( [ µNewDiv[0], µAnotherNewDiv[0] ] );
        assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 elements' );
        µNewDiv.remove();
        µAnotherNewDiv.remove();

        // NON FUNCTIONAL TEST
        // this is a future ability and cannot be tested yet
        //
        // µTarget.append( [ '<div.a--new--div>', '<div.a--new--div>' ] );
        // assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 creation strings' );
        // µNewDiv.remove();
        // µAnotherNewDiv.remove();


        var el;
        var µDiv = µ( 'div' ).first();
        var $Div = $( 'div' ).first();

        var vanillaRemove = function( el )
        {
            el.parentNode.removeChild( el );
        };

        buildTest(
        'µDiv.append( el )', function()
        {
            el = document.createElement( 'div' );
            µDiv.append( el );

            vanillaRemove( el );
        },

        '$Div.append( el )', function()
        {
            el = document.createElement( 'div' );
            $Div.append( el );

            vanillaRemove( el );
        }, 60 );
    });


    QUnit.test( '.insertAfter()', function( assert )
    {
        assert.ok( µ().insertAfter, 'exists' );

        var µTarget = µ( '#example--id' );
        var µTargetIndex = µTarget.getParentIndex()[0];

        var µTargetParent = µTarget.parent();
        var µTargetParentChildren = µTargetParent.children()[0].length;

        var _el = '<addedDivThing>';
        µTarget.insertAfter( _el );
        assert.equal( µTargetParentChildren + 1, µTargetParent.children()[0].length, 'add by new string' );
        µ( 'addedDivThing' ).remove();


        var µEl = µ( _el );
        µTarget.insertAfter( µEl );
        assert.equal( µTargetParentChildren + 1, µTargetParent.children()[0].length, 'add by new microbe' );
        µ( 'addedDivThing' ).remove();

        µEl = µ( '<addedDivThing>' )[0];
        µTarget.insertAfter( µEl );
        assert.equal( µTargetParentChildren + 1, µTargetParent.children()[0].length, 'add by new element' );
        µ( 'addedDivThing' ).remove();


        var siblingDiv      = document.getElementById( 'qunit' );
        var µSiblingDiv     = µ( siblingDiv );
        var $SiblingDiv     = $( siblingDiv );
        var parentDiv       = siblingDiv.parentNode;

        var vanillaCreate = function( i )
        {
            var el  = document.createElement( 'div' );
            el      = [ µ( el ), $( el ) ];

            return el[ i ];
        };

        var vanillaRemove = function( el )
        {
            parentDiv.removeChild( el[ 0 ] );
        };

        buildTest(
        'µDiv.insertAfter( el )', function()
        {
            var µEl = vanillaCreate( 0 );

            µSiblingDiv.insertAfter( µEl );

            vanillaRemove( µEl );
        },

        '$Div.insertAfter( el )', function()
        {
            var $El = vanillaCreate( 1 );

            $El.insertAfter( $SiblingDiv );

            vanillaRemove( $El );
        }, 61 );
    });



    QUnit.test( '.remove()', function( assert )
    {
        assert.ok( µ().remove, 'exists' );

        var µFirstDiv   = µ( 'div' ).first();
        µFirstDiv.append( µ( '<divdiv.divide>' )[0] );

        µ( 'divdiv' ).remove();

        assert.equal( µ( 'divdiv' ).length, 0, 'is completely removed' );

        var el, $El, µEl;
        var parentDiv   = µ( 'div' )[0];

        var vanillaAdd = function()
        {
            el = document.createElement( 'div' );
            µEl         = µ( el );
            $El         = $( el );

            parentDiv.appendChild( el );
            return el;
        };

        buildTest(
        'µDiv.remove()', function()
        {
            vanillaAdd();
            µEl.remove();
        },

        '$Div.remove()', function()
        {
            vanillaAdd();
            $El.remove();
        }, 62 );
    });
};
