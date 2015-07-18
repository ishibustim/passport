﻿var registering = false;

var usersPostURL = 'http://dev.ishibustim.homenet.org/passport/modules/webservice/users.php';

var global_username = '';
var global_password = '';

function users_addEventListeners()
{
    $('#signIn_register').click(beginRegister);
    $('#signIn_register_cancel').click(cancelRegister);
    $('#signIn_logIn').click(signIn);
    $('#logOut').click(signOut);
}//end addEventListeners

function beginRegister()
{
    if (!registering) {
        registering = true;
        $('#signIn input[name="verifyPassword"]').parent().removeClass('hidden');
        $('#signIn_logIn').addClass('hidden');
        $('#signIn_register_cancel').removeClass('hidden');
    }//end if
    else {
        var username = $('input[name="username"]').val();
        var password = $('input[name="password"]').val();
        var verifyPassword = $('input[name="verifyPassword"]').val();

        if (password == verifyPassword && password.length >= 8) {
            // register with webservice
            $.post(usersPostURL, {
                action: 'newUser',
                username: username,
                password: password,
                verifyPassword: verifyPassword
            }, function (data, status, xhr) {
                if (status == 'success') {
                    var result = $('result', data).text();
                    if (result == 'success') {
                        alert('Account Created');
                        signIn();
                    }//end if
                    else if (result == 'duplicate') {
                        alert('Username already exists');
                    }
                    else {
                        alert('Could not create account');
                    }//end else
                }//end if
                else
                    alert('Could not create account');
            });//end $.post
        }//end if
        else if(password != verifyPassword) {
            alert('Passwords must match');
        }//end else if password match
        else if (password.length < 8) {
            alert('Password must be longer than 8 characters');
        }//end else if password length
    }//end else (submit newUser request)
}//end beginRegister

function cancelRegister()
{
    if (registering) {
        registering = false;
        $('#signIn input[name="verifyPassword"]').parent().addClass('hidden');
        $('#signIn_logIn').removeClass('hidden');
        $('#signIn_register_cancel').addClass('hidden');
    }//end if
}//end cancelRegister

function signIn()
{
    var username = $('input[name="username"]').val();
    var password = $('input[name="password"]').val();

    if (password.length >= 8) {
        $.post(usersPostURL, {
            action: 'signIn',
            username: username,
            password: password
        }, function (data, status, xhr) {
            if (status == 'success') {
                var result = $('result', data).text();
                if (result == 'success') {
                    // sign in and display homepage
                    global_username = username;
                    global_password = password;
                    $('#username').html(global_username);
                    $('#preSignIn').addClass('hidden');
                    $('#postSignIn').removeClass('hidden');
                    
                    // clear sign in fields
                    $('input[name="username"', '#signIn').val('');
                    $('input[name="password"', '#signIn').val('');
                    $('input[name="verifyPassword"', '#signIn').val('');
                }//end if
                else if (result == 'fail') {
                    alert('Username and Password do not match');
                }//end else if
                else {
                    alert('Unknown Error');
                }//end else
            }//end if
            else {
                alert('Unable to sign in');
            }//end else
        });//end $.post
    }//end if
    else {
        alert('Password must be longer than 8 characters');
    }//end else
}//end signIn

function signOut() {
    global_username = '';
    global_password = '';
    $('#postSignIn').addClass('hidden');
    $('#preSignIn').removeClass('hidden');
    $('#username').html('');
}//end signOut