class HomesController < ApplicationController
  # GET /homes
  # GET /homes.json
  def index
    respond_to do |format|
      format.html # index.html.haml
    end
  end
  
  def design
    respond_to do |format|
      format.html # design.html.haml
    end
  end

  def pricing
    respond_to do |format|
      format.html # model.html.haml
    end
  end
end
