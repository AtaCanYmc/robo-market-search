class RoboMarketSearch < Formula
  desc "Hardware component aggregator, price search engine and AI agent system"
  homepage "https://github.com/AtaCanYmc/robo-market-search"
  url "https://github.com/AtaCanYmc/robo-market-search/archive/refs/tags/v1.3.0.tar.gz"
  sha256 "0000000000000000000000000000000000000000000000000000000000000000" # Updated automatically on release
  license "Apache-2.0"

  depends_on "python@3.11"

  def install
    virtualenv_install_with_resources
  end

  test do
    system "#{bin}/robo-search", "--version"
  end
end
