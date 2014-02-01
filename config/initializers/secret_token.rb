# Be sure to restart your server when you modify this file.

# Your secret key is used for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!

# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.
# You can use `rake secret` to generate a secure secret key.

# Make sure your secret_key_base is kept private
# if you're sharing your code publicly.
Chat::Application.config.secret_key_base = 'b70448dccc6f9282b3225ee21d2983d23133a967e864ee1ae36851b36c2c0b40aaee551ff58629eb10f1241965720e8db9bb6132fdf5233872895be5831d04d6'
