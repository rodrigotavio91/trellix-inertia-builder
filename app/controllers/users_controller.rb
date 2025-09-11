class UsersController < ApplicationController
  prevent_authenticated_access

  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to new_user_url, inertia: { errors: "Try again later." } }

  def new
  end

  def create
    if user = User.create!(params.permit(:email_address, :password))
      start_new_session_for user
      redirect_to after_authentication_url
    else
      redirect_to new_session_path, inertia: { errors: user.errors.messages }
    end
  end
end
