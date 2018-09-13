require "graphviz"
require "tempfile"
require "cgi"

class GenerateSiteDiagram
  attr_reader :site

  NODE_WIDTH = 180

  FONTS = {
    normal: "Arial",
    bold: "Arial Bold",
    italic: "Arial Italic"
  }.freeze

  NODE_ATTRIBUTES = {
    fontsize: 10,
    fontname: FONTS[:normal],
    margin: "0.07,0.05",
    penwidth: 1.0
  }.freeze

  EDGE_ATTRIBUTES = {
    fontname: FONTS[:normal],
    fontsize: 7,
    dir: :both,
    penwidth: 1.0,
    labelangle: 32,
    labeldistance: 1.8,
    weight: 0.5,
    arrowhead: "onormal",
    arrowtail: "none",
    arrowsize: 0.8,
    color: :grey60
  }.freeze

  GRAPH_ATTRIBUTES = {
    concentrate: true,
    fontname: FONTS[:bold],
    fontsize: 13,
    labelloc: :t,
    margin: "0,0",
    nodesep: 0.4,
    pad: "0.4,0.4",
    rankdir: :LR,
    ranksep: 0.5
  }.freeze

  def initialize(site)
    @site = site
  end

  def create
    site.item_types.each { |item_type| add_node(item_type) }
    site.item_types.each { |item_type| add_edges(item_type) }

    file = Tempfile.new("site")
    graph.output(pdf: file.path)
    file
  end

  private

  def graph
    @graph ||= GraphViz.digraph(site.name).tap do |graph|
      apply_defaults(graph, GRAPH_ATTRIBUTES)
      apply_defaults(graph.node, NODE_ATTRIBUTES)
      apply_defaults(graph.edge, EDGE_ATTRIBUTES)
      graph[:label] = site.name + "\n" * 2
    end
  end

  def apply_defaults(object, attributes)
    attributes.each do |attribute, value|
      object[attribute] = value
    end
  end

  def add_node(item_type)
    # this line is needed to render the template!
    # rubocop:disable Lint/UselessAssignment
    fields = item_type.fields.sort_by(&:position)
    # rubocop:enable Lint/UselessAssignment

    node = graph.add_node(item_type.id.to_s)
    node[:label] = "<#{read_template(:item_type).result(binding)}>"
    node[:shape] = item_type.singleton ? "record" : "Mrecord"
  end

  def field_required?(field)
    !field.validators["required"].nil?
  end

  def escape_html(string)
    CGI.escapeHTML(string)
  end

  def add_edges(item_type)
    add_relationship_edges(
      item_type,
      Agave::FieldType::Link.code,
      "item_item_type"
    )

    add_relationship_edges(
      item_type,
      Agave::FieldType::Links.code,
      "items_item_type"
    )

    add_relationship_edges(
      item_type,
      Agave::FieldType::RichText.code,
      "rich_text_blocks"
    )
  end

  def add_relationship_edges(item_type, field_type_code, validator)
    item_type.fields.where(field_type: field_type_code).
      each do |field|
      field.validators[validator]["item_types"].each do |id|
        graph.add_edge(
          item_type.id.to_s,
          id,
          label: field.field_type
        )
      end
    end
  end

  def read_template(type)
    ERB.new(File.read(Rails.root.join("templates/#{type}.erb")), nil, "<>")
  end
end
